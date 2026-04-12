// app/api/assignments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/assignments
 * Retrieve all assignments
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const assetId = searchParams.get('assetId');
    const employeeId = searchParams.get('employeeId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (assetId) where.assetId = assetId;
    if (employeeId) where.employeeId = employeeId;

    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: { asset: true, employee: true },
        orderBy: { assignmentDate: 'desc' },
      }),
      prisma.assignment.count({ where }),
    ]);

    return NextResponse.json({
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assignments
 * Create a new assignment (issue device)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, employeeId, notes, returnDate } = body;

    // Validation
    if (!assetId || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify asset exists and is available
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    if (asset.status !== 'available') {
      return NextResponse.json(
        { error: `Asset is not available. Current status: ${asset.status}` },
        { status: 400 }
      );
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        assetId,
        employeeId,
        assignmentDate: new Date(),
        status: 'assigned',
        notes: notes || null,
        returnDate: returnDate ? new Date(returnDate) : null,
      },
      include: { asset: true, employee: true },
    });

    // Update asset status
    await prisma.asset.update({
      where: { id: assetId },
      data: { status: 'assigned' },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        assetId,
        employeeId,
        action: 'assign',
        description: `Asset ${asset.assetId} assigned to ${employee.name}`,
        newValue: JSON.stringify(assignment),
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('POST /api/assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}
