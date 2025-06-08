import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { post_id: string } }
) {
  const post_id = parseInt(params.post_id);

  try {
    // Delete all comments associated with the post first
    await prisma.comments.deleteMany({
      where: {
        post_id: post_id,
      },
    });

    // Delete all reactions associated with the post
    await prisma.reactions.deleteMany({
      where: {
        post_id: post_id,
      },
    });

    // Delete the post
    await prisma.posts.delete({
      where: {
        post_id: post_id,
      },
    });

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