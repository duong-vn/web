import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const group = await prisma.groups.findUnique({
      where: {
        group_id: Number(params.id),
      },
      include: {
        group_members: {
          include: {
            users: {
              select: {
                username: true,
                full_name: true,
                image: true,
              }
            }
          }
        },
        posts: {
          include: {
            users: {
              select: {
                username: true,
                full_name: true,
                image: true,
              }
            },
            comments: {
              include: {
                users: {
                  select: {
                    username: true,
                    full_name: true,
                    image: true,
                  }
                }
              }
            },
            reactions: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { message: 'Group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching group' },
      { status: 500 }
    );
  }
} 