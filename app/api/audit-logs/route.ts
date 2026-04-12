// app/api/audit-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/audit-logs
 * Retrieve audit logs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assetId = searchParams.get('assetId');
    const employeeId = searchParams.get('employeeId');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (assetId && assetId !== 'undefined') where.assetId = assetId;
    if (employeeId && employeeId !== 'undefined') where.employeeId = employeeId;
    if (action && action !== 'undefined') where.action = action;
    
    if ((startDate && startDate !== 'undefined') || (endDate && endDate !== 'undefined')) {
      where.timestamp = {};
      if (startDate && startDate !== 'undefined') {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) where.timestamp.gte = start;
      }
      if (endDate && endDate !== 'undefined') {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) where.timestamp.lte = end;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: { asset: true, employee: true },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/audit-logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
