import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {prisma} from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const user_id = searchParams.get("user_id");
  try {
    const posts: Post[] = await prisma.$queryRaw`
        SELECT
    p.post_id,
    p.content,
    p.created_at,
    p.user_id,
    p.group_id,
    p.image,
    g.privacy,
    g.group_name,
    g.image as group_image,
    u.username,
    u.image as user_image
FROM
    posts p
JOIN
    users u ON p.user_id = u.user_id
JOIN
    groups g ON p.group_id = g.group_id
WHERE
    
    g.privacy = 'public'
    OR
    
    p.group_id IN (
        SELECT gm.group_id
        FROM group_members gm
        WHERE gm.user_id = ${user_id} 
    )
ORDER BY
    p.created_at DESC;
    `;

    if (posts.length == 0 ) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { group_id, user_id, content, image } = body;

    // Validate required fields
    if (!group_id || !user_id || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is a member of the group
    const groupMember = await prisma.group_members.findFirst({
      where: {
        group_id: Number(group_id),
        user_id: Number(user_id)
      }
    });
    let finalImage = null;
    if (image && image.trim() !== '') {
      finalImage = image;
    }

    if (!groupMember) {
      return NextResponse.json(
        { message: 'User is not a member of this group' },
        { status: 403 }
      );
    }

    // Create the post
    const post = await prisma.$executeRaw`
      INSERT INTO posts(user_id,group_id,image,content)
      VALUES (${user_id},${group_id},${finalImage},${content})
    
    `

    return NextResponse.json({message:'Succesfully create post'},{status:201});
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Failed to create post' },
      { status: 500 }
    );
  }
}