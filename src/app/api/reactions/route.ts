import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET reactions for a post or comment
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');
    const comment_id = searchParams.get('comment_id');

    if (!post_id && !comment_id) {
      return NextResponse.json(
        { message: 'Either post_id or comment_id is required' },
        { status: 400 }
      );
    }

    let reactions;
    if (post_id) {
      reactions = await prisma.$queryRaw`
        SELECT 
         
      `;
    } else {
      reactions = await prisma.$queryRaw`
        SELECT 
          r.reaction_id,
          r.type,
          r.created_at,
          r.user_id,
          r.comment_id,
          u.username,
          u.full_name,
          u.image as user_image
        FROM reactions r
        LEFT JOIN users u ON r.user_id = u.user_id
        WHERE r.comment_id = ${comment_id}
        ORDER BY r.created_at DESC
      `;
    }

    return NextResponse.json(reactions);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching reactions' },
      { status: 500 }
    );
  }
}

// POST create new reaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, user_id, post_id, comment_id } = body;

    if (!type || !user_id || (!post_id && !comment_id)) {
      return NextResponse.json(
        { message: 'Type, user ID, and either post ID or comment ID are required' },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    const existingReaction = await prisma.$queryRaw`
      SELECT reaction_id FROM reactions 
      WHERE user_id = ${user_id} 
      AND (${post_id ? `post_id = ${post_id}` : 'post_id IS NULL'})
      AND (${comment_id ? `comment_id = ${comment_id}` : 'comment_id IS NULL'})
    `;

    if (existingReaction) {
      return NextResponse.json(
        { message: 'Reaction already exists' },
        { status: 400 }
      );
    }

    const reaction = await prisma.$queryRaw`
      INSERT INTO reactions (type, user_id, post_id, comment_id, created_at)
      VALUES (${type}, ${user_id}, ${post_id}, ${comment_id}, NOW())
      RETURNING *
    `;

    return NextResponse.json(
      { message: 'Reaction created successfully', reaction },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating reaction' },
      { status: 500 }
    );
  }
}

// DELETE reaction
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { reaction_id } = body;

    if (!reaction_id) {
      return NextResponse.json(
        { message: 'Reaction ID is required' },
        { status: 400 }
      );
    }

    const result = await prisma.$queryRaw`
      DELETE FROM reactions WHERE reaction_id = ${reaction_id}
      RETURNING reaction_id
    `;

    if (!result) {
      return NextResponse.json(
        { message: 'Reaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Reaction deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting reaction' },
      { status: 500 }
    );
  }
} 