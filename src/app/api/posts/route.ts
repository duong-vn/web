import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(){
  try {
    const posts = await prisma.$queryRaw<Post[]>`
      SELECT p.post_id, p.content, p.created_at, p.user_id, p.group_id, p.image
      From posts p 
    `

    if (!posts) {
     return NextResponse.json({message: 'No posts found'}, {status: 404});

       }
       return NextResponse.json(posts);
} catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({message: 'Error fetching posts'}, {status: 500});
  }

}