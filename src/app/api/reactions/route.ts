import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';




// GET reactions for a post or comment
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const post_id = searchParams.get('post_id');
    const comment_id = searchParams.get('comment_id');

    if (!post_id && !comment_id) {
      return NextResponse.json(
        { message: 'Either post_id or comment_id is required' },
        { status: 400 }
      );
    }

    let reactions;
    if (post_id) {
      reactions= await prisma.$queryRaw<any>`
        SELECT 
         COUNT(reaction_id) as likeCount
         FROM 
         reactions r
         Where post_id = ${post_id}
      `;
      console.log("reaction from post_id ",reactions)
      const reaction = reactions[0];
     
      return NextResponse.json(reaction);
    } else {
      reactions = await prisma.$queryRaw<any>`
        SELECT 
         COUNT(reaction_id) as likeCount
         FROM 
         reactions r
         Where comment_id = ${comment_id}
     
      `;
      const reaction = reactions[0];
      return NextResponse.json(reaction);
    }

    return NextResponse.json(reactions);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching reactions' },
      { status: 500 }
    );
  }
}

// POST create new reaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {user_id} = body;
    const {searchParams} = new URL(request.url)
    
    const post_id = searchParams.get('post_id');
    const comment_id = searchParams.get('comment_id');

    if ( !user_id) {
      return NextResponse.json(
        { message: 'You need to login to react' },
        { status: 400 }
      );
    }
    if (!post_id && !comment_id) {
      return NextResponse.json(
        { message: 'No post or comment' },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    if ( post_id){

     await prisma.$queryRaw`
      INSERT INTO reactions (user_id, post_id)
      VALUES (${user_id}, ${post_id})
     
    `;
    return NextResponse.json(
      { message: 'Reaction created successfully' },
      { status: 201 })
    
    }else {
      await prisma.$queryRaw`
      INSERT INTO reactions (user_id, comment_id)
      VALUES (${user_id},  ${comment_id})
     `

      return NextResponse.json(
        { message: 'Reaction created successfully', },
        { status: 201 })
      
    }

    
    ;
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating reaction', error },
      { status: 500 }
    );
  }
}

// DELETE reaction
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { reaction_id } = body;

    if (!reaction_id) {
      return NextResponse.json(
        { message: 'Reaction ID is required' },
        { status: 400 }
      );
    }

    const result = await prisma.$queryRaw`
      DELETE FROM reactions WHERE reaction_id = ${reaction_id}
      RETURNING reaction_id
    `;

    if (!result) {
      return NextResponse.json(
        { message: 'Reaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Reaction deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting reaction' },
      { status: 500 }
    );
  }
} 
