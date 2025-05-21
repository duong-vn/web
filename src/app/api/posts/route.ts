import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all posts
export async function GET() {
  try {
    const posts = await prisma.$queryRaw`
      SELECT 
        p.post_id,
        p.content,
        p.image,
        p.created_at,
        p.updated_at,
        p.user_id,
        p.group_id,
        u.username,
        u.full_name,
        u.image as user_image,
        g.group_name,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comment_count,
        (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id) as reaction_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN groups g ON p.group_id = g.group_id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, image, user_id, group_id } = body;

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    const post = await prisma.$queryRaw`
      INSERT INTO posts (content, image, user_id, group_id, created_at, updated_at)
      VALUES (${content}, ${image}, ${user_id}, ${group_id}, NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating post' },
      { status: 500 }
    );
  }
}

// PUT update post
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { post_id, content, image } = body;

    if (!post_id || !content) {
      return NextResponse.json(
        { message: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    const post = await prisma.$queryRaw`
      UPDATE posts 
      SET content = ${content}, 
          image = ${image},
          updated_at = NOW()
      WHERE post_id = ${post_id}
      RETURNING *
    `;

    if (!post[0]) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Post updated successfully', post: post[0] }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating post' },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { post_id } = body;

    if (!post_id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // First delete related records
    await prisma.$queryRaw`
      DELETE FROM comments WHERE post_id = ${post_id}
    `;
    await prisma.$queryRaw`
      DELETE FROM reactions WHERE post_id = ${post_id}
    `;

    // Then delete the post
    const result = await prisma.$queryRaw`
      DELETE FROM posts WHERE post_id = ${post_id}
      RETURNING post_id
    `;

    if (!result[0]) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Post deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting post' },
      { status: 500 }
    );
  }
} 