// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DashboardStats } from '@/types';

/**
 * GET /api/dashboard
 * Retrieve dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const [
      totalAssets,
      assignedAssets,
      availableAssets,
      damagedAssets,
      totalEmployees,
      assets,
      assignments,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'assigned' } }),
      prisma.asset.count({ where: { status: 'available' } }),
      prisma.asset.count({ where: { condition: 'damaged' } }),
      prisma.employee.count(),
      prisma.asset.findMany(),
      prisma.assignment.findMany({
        where: { status: 'assigned' },
        include: { employee: true },
      }),
    ]);

    // Count by device type
    const assetsByType: Record<string, number> = {};
    assets.forEach((asset) => {
      assetsByType[asset.deviceType] = (assetsByType[asset.deviceType] || 0) + 1;
    });

    // Count by department
    const assetsByDepartment: Record<string, number> = {};
    assignments.forEach((assignment) => {
      const dept = assignment.employee.department;
      assetsByDepartment[dept] = (assetsByDepartment[dept] || 0) + 1;
    });

    const stats: DashboardStats = {
      totalAssets,
      assignedAssets,
      availableAssets,
      damagedAssets,
      totalEmployees,
      assetsByType,
      assetsByDepartment,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
