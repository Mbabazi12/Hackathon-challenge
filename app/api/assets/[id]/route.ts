// app/api/assets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/assets/:id
 * Retrieve a specific asset
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: {
        assignments: { include: { employee: true } },
        auditLogs: { orderBy: { timestamp: 'desc' }, take: 10 },
        conditionHistories: { orderBy: { changedAt: 'desc' }, take: 10 },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('GET /api/assets/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/assets/:id
 * Update an asset
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const previousValue = JSON.stringify(asset);

    const updatedAsset = await prisma.asset.update({
      where: { id: params.id },
      data: {
        ...(body.deviceType && { deviceType: body.deviceType }),
        ...(body.brand && { brand: body.brand }),
        ...(body.model && { model: body.model }),
        ...(body.specifications && {
          specifications: JSON.stringify(body.specifications),
        }),
        ...(body.condition && { condition: body.condition }),
        ...(body.status && { status: body.status }),
        ...(body.location !== undefined && { location: body.location }),
      },
    });

    // Log condition change if applicable
    if (body.condition && body.condition !== asset.condition) {
      await prisma.conditionHistory.create({
        data: {
          assetId: asset.id,
          previousCondition: asset.condition,
          newCondition: body.condition,
          reason: body.conditionReason || '',
        },
      });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        assetId: asset.id,
        action: 'update',
        description: `Asset updated: ${asset.assetId}`,
        previousValue,
        newValue: JSON.stringify(updatedAsset),
      },
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error('PUT /api/assets/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/assets/:id
 * Delete an asset
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: { assignments: true },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Check if asset is assigned
    const activeAssignment = asset.assignments.find((a) => !a.returnDate);
    if (activeAssignment) {
      return NextResponse.json(
        { error: 'Cannot delete asset that is currently assigned' },
        { status: 400 }
      );
    }

    await prisma.asset.delete({
      where: { id: params.id },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        assetId: asset.id,
        action: 'delete',
        description: `Asset deleted: ${asset.assetId}`,
        previousValue: JSON.stringify(asset),
      },
    });

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/assets/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
