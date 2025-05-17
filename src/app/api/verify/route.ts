import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../prisma/node_modules/.prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        group_members:true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get user role from group_members
    const role = user.group_members[0]?.role || 'user';

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
