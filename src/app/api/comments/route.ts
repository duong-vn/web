import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all comments for a post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');

    if (!post_id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.$queryRaw`
      SELECT 
        c.comment_id,
        c.content,
        c.created_at,
        c.updated_at,
        c.user_id,
        c.post_id,
        u.username,
        u.full_name,
        u.image as user_image,
        (SELECT COUNT(*) FROM reactions WHERE comment_id = c.comment_id) as reaction_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = ${post_id}
      ORDER BY c.created_at DESC
    `;

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching comments' },
      { status: 500 }
    );
  }
}

// POST create new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, user_id, post_id } = body;

    if (!content || !user_id || !post_id) {
      return NextResponse.json(
        { message: 'Content, user ID, and post ID are required' },
        { status: 400 }
      );
    }

    const comment = await prisma.$queryRaw`
      INSERT INTO comments (content, user_id, post_id, created_at, updated_at)
      VALUES (${content}, ${user_id}, ${post_id}, NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json(
      { message: 'Comment created successfully', comment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating comment' },
      { status: 500 }
    );
  }
}

// PUT update comment
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { comment_id, content } = body;

    if (!comment_id || !content) {
      return NextResponse.json(
        { message: 'Comment ID and content are required' },
        { status: 400 }
      );
    }

    const comment = await prisma.$queryRaw`
      UPDATE comments 
      SET content = ${content},
          updated_at = NOW()
      WHERE comment_id = ${comment_id}
      RETURNING *
    `;

    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Comment updated successfully', comment }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating comment' },
      { status: 500 }
    );
  }
}

// DELETE comment
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { comment_id } = body;

    if (!comment_id) {
      return NextResponse.json(
        { message: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // First delete related reactions
    await prisma.$queryRaw`
      DELETE FROM reactions WHERE comment_id = ${comment_id}
    `;

    // Then delete the comment
    const result = await prisma.$queryRaw`
      DELETE FROM comments WHERE comment_id = ${comment_id}
      RETURNING comment_id
    `;

    if (!result) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Comment deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting comment' },
      { status: 500 }
    );
  }
} 