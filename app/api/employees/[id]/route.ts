// app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/employees/:id
 * Retrieve a specific employee
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          include: { asset: true },
          orderBy: { assignmentDate: 'desc' },
        },
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('GET /api/employees/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/employees/:id
 * Update an employee
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.department && { department: body.department }),
        ...(body.designation !== undefined && { designation: body.designation }),
        ...(body.phone !== undefined && { phone: body.phone }),
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('PUT /api/employees/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/employees/:id
 * Delete an employee
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: { assignments: true },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if employee has active assignments
    const activeAssignment = employee.assignments.find((a) => !a.returnDate);
    if (activeAssignment) {
      return NextResponse.json(
        {
          error: 'Cannot delete employee with active asset assignments',
        },
        { status: 400 }
      );
    }

    await prisma.employee.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/employees/:id error:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
