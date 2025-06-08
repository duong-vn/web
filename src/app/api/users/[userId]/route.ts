import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request:NextRequest,{params}:{params:{userId:string}}){
    const {userId} = params;
    console.log("user ID in the paraams",userId);

    try {
        const data:User[] = await prisma.$queryRaw`
            Select *
            From users
            Where user_id = ${userId}
   
            `
            const user = data[0];
            console.log("get data each user",data);
            
        
        if (!user ){
            return NextResponse.json({message:'Cannot find user'},{status:404})

        }
       
        return NextResponse.json({message:'found user',user},{status:200})



    }catch(error){
        return NextResponse.json({message:'error fetching user by userId',error},{status:500})
    }


}