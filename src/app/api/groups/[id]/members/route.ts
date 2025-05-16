import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all members of a group
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const members = await prisma.group_members.findMany({
      where: {
        group_id: Number(params.id),
      },
      include: {
        users: {
          select: {
            username: true,
            full_name: true,
            image: true,
          }
        }
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching group members' },
      { status: 500 }
    );
  }
}

// POST add a new member to the group
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { user_id, role = 'member' } = body;

    if (!user_id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.group_members.findUnique({
      where: {
        user_id_group_id: {
          user_id: Number(user_id),
          group_id: Number(params.id),
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: 'User is already a member of this group' },
        { status: 400 }
      );
    }

    // Add new member
    const member = await prisma.group_members.create({
      data: {
        group_id: Number(params.id),
        user_id: Number(user_id),
        role,
      },
    });

    // Update group member count
    await prisma.groups.update({
      where: {
        group_id: Number(params.id),
      },
      data: {
        number_of_members: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      { message: 'Member added successfully', member },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error adding member to group' },
      { status: 500 }
    );
  }
}

// DELETE remove a member from the group
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete member
    await prisma.group_members.delete({
      where: {
        user_id_group_id: {
          user_id: Number(user_id),
          group_id: Number(params.id),
        },
      },
    });

    // Update group member count
    await prisma.groups.update({
      where: {
        group_id: Number(params.id),
      },
      data: {
        number_of_members: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      { message: 'Member removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error removing member from group' },
      { status: 500 }
    );
  }
} 