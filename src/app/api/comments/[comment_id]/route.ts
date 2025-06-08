import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { comment_id: string } }
) {
  const comment_id = parseInt(params.comment_id);

  try {
    // Delete all reactions associated with the comment first
    await prisma.$executeRaw`
    DELETE FROM reactions 
    WHERE comment_id = ${comment_id}
  `;

  // Delete the comment
  await prisma.$executeRaw`
    DELETE FROM comments 
    WHERE comment_id = ${comment_id}
  `;
    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
} 