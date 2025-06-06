import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.$queryRaw`
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
      FROM posts p  
      JOIN groups g ON p.group_id = g.group_id
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
    `;

    if (!posts) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}
