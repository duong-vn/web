import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { post_id: string } }
) {
  const post_id = parseInt(params.post_id);

  try {
    
    await prisma.$executeRaw`
    DELETE FROM reactions 
    WHERE post_id = ${post_id}
  `;


    await prisma.$executeRaw`
    DELETE FROM comments 
    WHERE post_id = ${post_id}
  `;

 
  // Delete the post
  await prisma.$executeRaw`
    DELETE FROM posts 
    WHERE post_id = ${post_id}
  `;

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
} 