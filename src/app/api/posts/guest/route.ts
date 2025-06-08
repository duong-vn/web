import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";


interface Posts {
    post_id:number;
    content:string;
    user_id: number;
   group_id:number;
    image:string|null,
    privacy:string,
    group_name:string,
    group_image:string,
    username:string,
    user_image:string|null
}

export async function GET (){
  
 
try{
    const posts : Posts[] = await prisma.$queryRaw`
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
      Where g.privacy = 'public'
      ORDER BY p.created_at DESC
    `;
    
return  NextResponse.json( posts);

            }catch(error){
              return NextResponse.json({message: "Error while fetching posts",error},{status:500})
            }


   
   
        }


