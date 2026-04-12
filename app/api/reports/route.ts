// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/reports
 * Retrieve reports based on filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type'); // department, device-type, status, condition, date
    const filterValue = searchParams.get('filter');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let reportData;

    // Report by department
    if (reportType === 'department') {
      const assignments = await prisma.assignment.findMany({
        include: { employee: true, asset: true },
        orderBy: { assignmentDate: 'desc' },
      });

      const byDepartment: Record<string, any[]> = {};
      assignments.forEach((assignment) => {
        const dept = assignment.employee.department;
        if (!byDepartment[dept]) byDepartment[dept] = [];
        byDepartment[dept].push({
          asset: assignment.asset,
          employee: assignment.employee,
          assignmentDate: assignment.assignmentDate,
          returnDate: assignment.returnDate,
        });
      });

      reportData = Object.entries(byDepartment).map(([dept, items]) => ({
        department: dept,
        count: items.length,
        items,
      }));
    }

    // Report by device type
    else if (reportType === 'device-type') {
      const assets = await prisma.asset.findMany();

      const byType: Record<string, any[]> = {};
      for (const asset of assets) {
        if (!byType[asset.deviceType]) byType[asset.deviceType] = [];
        byType[asset.deviceType].push({
          assetId: asset.assetId,
          brand: asset.brand,
          model: asset.model,
          status: asset.status,
          condition: asset.condition,
        });
      }

      reportData = Object.entries(byType).map(([type, items]) => ({
        deviceType: type,
        count: items.length,
        items,
      }));
    }

    // Report by status
    else if (reportType === 'status') {
      const statuses = ['available', 'assigned', 'damaged', 'returned'];
      reportData = await Promise.all(
        statuses.map(async (status) => {
          const count = await prisma.asset.count({
            where: { status },
          });
          return { status, count };
        })
      );
    }

    // Report by condition
    else if (reportType === 'condition') {
      const conditions = ['new', 'good', 'damaged'];
      reportData = await Promise.all(
        conditions.map(async (condition) => {
          const count = await prisma.asset.count({
            where: { condition },
          });
          return { condition, count };
        })
      );
    }

    // Date range report (assignment history)
    else if (reportType === 'date') {
      const where: any = {};
      if (startDate) where.assignmentDate = { gte: new Date(startDate) };
      if (endDate) {
        if (where.assignmentDate) {
          where.assignmentDate.lte = new Date(endDate);
        } else {
          where.assignmentDate = { lte: new Date(endDate) };
        }
      }

      const assignments = await prisma.assignment.findMany({
        where,
        include: { asset: true, employee: true },
        orderBy: { assignmentDate: 'desc' },
      });

      reportData = assignments.map((a) => ({
        date: a.assignmentDate,
        assetId: a.asset.assetId,
        employeeName: a.employee.name,
        department: a.employee.department,
        action: a.returnDate ? 'returned' : 'assigned',
      }));
    }

    return NextResponse.json({ reportType, data: reportData });
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
