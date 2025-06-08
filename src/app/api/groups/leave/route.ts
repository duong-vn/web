import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// DELETE group
export async function DELETE(request: Request) {
  try {
   const {searchParams} = new URL(request.url);
    const group_id = searchParams.get('group_id');
    const user_id = searchParams.get('user_id');

    if (!group_id) {
      return NextResponse.json(
        { message: "Group ID is required" },
        { status: 400 }
      );
    }
   

  // Delete the user from group members
  await prisma.$executeRaw`
    DELETE FROM group_members 
    WHERE group_id = ${group_id} 
    AND user_id = ${user_id}
  `;



    return NextResponse.json(
      { message: "Leave successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete group error:", error);
    return NextResponse.json(
      { message: "Error deleting group", error },

      { status: 500 }
    );
  }
}
