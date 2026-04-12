// app/api/assets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAssetId } from '@/lib/utils';

/**
 * GET /api/assets
 * Retrieve all assets with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceType = searchParams.get('deviceType');
    const status = searchParams.get('status');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (deviceType && deviceType !== 'undefined') where.deviceType = deviceType;
    if (status && status !== 'undefined') where.status = status;
    if (condition && condition !== 'undefined') where.condition = condition;
    if (search && search !== 'undefined' && search.trim()) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { assetId: { contains: searchLower } },
        { serialNumber: { contains: searchLower } },
        { model: { contains: searchLower } },
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    return NextResponse.json({
      data: assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/assets error:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

/**
 * POST /api/assets
 * Create a new asset
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      deviceType,
      brand,
      model,
      serialNumber,
      specifications,
      purchaseDate,
      condition,
      location,
    } = body;

    // Validation
    if (!deviceType || !brand || !model || !serialNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if serial number already exists
    const existing = await prisma.asset.findUnique({
      where: { serialNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Asset with this serial number already exists' },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.create({
      data: {
        assetId: generateAssetId(),
        deviceType,
        brand,
        model,
        serialNumber,
        specifications: JSON.stringify(specifications || {}),
        purchaseDate: new Date(purchaseDate),
        condition: condition || 'good',
        status: 'available',
        location: location || null,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        assetId: asset.id,
        action: 'create',
        description: `Asset created: ${asset.assetId}`,
        newValue: JSON.stringify(asset),
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('POST /api/assets error:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}
