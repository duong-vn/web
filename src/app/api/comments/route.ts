import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

import { getComments } from "@/app/services/apiServices";
interface Comment {
  comment_id: number;
  content: string;
  created_at: Date;
  user_id: number;
  post_id: number;
  image: string | null;
  username: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const post_id = Number(searchParams.get("post_id"));
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  try {
    const res = await getComments(post_id);
    const data = await res.json();
    const allComments: Comment[] = data.comments;
    const start = (page - 1) * limit;
    const end = start + limit;
    const hasMore = allComments.length > end;
    const paginatedComments = allComments.slice(start, end);

    return NextResponse.json({ paginatedComments, hasMore }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { post_id, content, user_id } = await request.json();
  console.log("post_id", post_id);
  console.log("content", content);
  console.log("user_id", user_id);

  if (!post_id || !content || !user_id) {
    return NextResponse.json(
      { message: "Post ID, content and user ID are required" },
      { status: 400 }
    );
  }

  try {
    const newComment = await prisma.comments.create({
      data: {
        post_id,
        content,
        user_id,
      },
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
