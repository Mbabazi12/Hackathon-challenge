// app/api/assignments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/assignments/:id
 * Retrieve a specific assignment
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { asset: true, employee: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('GET /api/assignments/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/assignments/:id
 * Update an assignment
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { asset: true, employee: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: { asset: true, employee: true },
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('PUT /api/assignments/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assignments/:id/return
 * Return an asset (handled via separate route)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { asset: true, employee: true },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    if (assignment.status !== 'assigned') {
      return NextResponse.json(
        { error: 'Assignment is not currently active' },
        { status: 400 }
      );
    }

    // Mark assignment as returned
    const returnedAssignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        returnDate: new Date(),
        status: 'returned',
      },
      include: { asset: true, employee: true },
    });

    // Update asset status to available
    await prisma.asset.update({
      where: { id: assignment.assetId },
      data: { status: 'available' },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        assetId: assignment.assetId,
        employeeId: assignment.employeeId,
        action: 'return',
        description: `Asset ${assignment.asset.assetId} returned by ${assignment.employee.name}`,
        newValue: JSON.stringify(returnedAssignment),
      },
    });

    return NextResponse.json(returnedAssignment);
  } catch (error) {
    console.error('DELETE /api/assignments/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to return assignment' },
      { status: 500 }
    );
  }
}
