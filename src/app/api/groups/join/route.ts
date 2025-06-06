import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest){
    const {searchParams} = await new URL(request.url);
    const user_id =  searchParams.get('user_id');
    const group_id =  searchParams.get('group_id');

    try {
        await prisma.$executeRaw`
            INSERT INTO group_members(user_id,group_id) VALUES
            (${user_id},${group_id})

        `
        
        return NextResponse.json({message:'Join group succesfully'},{status:201})

    }catch (error){

        return NextResponse.json({message:'Error while joining group', error}, {status:500})
    }

}