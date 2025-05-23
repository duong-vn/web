    import { NextRequest,NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
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
    const {searchParams} = new URL(request.url);
    const post_id = Number(searchParams.get("post_id"));
    

    console.log(post_id);
        try{ 
              const comments :Comment[] = await prisma.$queryRaw`
              SELECT c.*, u.username, u.image 
              FROM comments c 
              Join users u ON u.user_id = c.user_id
              
              WHERE c.post_id = ${post_id}
              `;
                
                if (!comments) {
                    return NextResponse.json({message: 'No comments found'}, {status: 404});
                }
                return NextResponse.json({comments}, {status: 200});


        }catch (error) {
            console.log(error);
            return NextResponse.json({error: "Something went wrong"}, {status: 500});
        }


    }