import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all groups
export async function GET() {
  try {
    const groups = await prisma.$queryRaw`
      Select *
      from groups
      Order by group_id DESC
    
    `
    
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching groups' },
      { status: 500 }
    );
  }
}

// POST create new group
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { group_name , created_by,description } = body;
    const {image} = body ?? null;

    console.log("create group data from server side",body);
    console.log("image from server side",image, typeof null);
    
    if (!group_name) {
      return NextResponse.json(
        { message: 'Group name is required' },
        { status: 400 }
      );
    }

    const groups = await prisma.$queryRaw<Group[]>`
    INSERT INTO groups (group_name, description, created_by,image,number_of_members)
    OUTPUT inserted.*
    VALUES (${body.group_name}, ${description}, ${created_by}, ${image??''},1);
  `;
  // var groups : Group[] = [];
  // if(image){  
  //    groups = await prisma.$queryRaw<Group[]>`
  //   INSERT INTO groups (group_name, description, created_by,image,number_of_members)
  //   OUTPUT inserted.*
  //   VALUES (${body.group_name}, ${description}, ${created_by}, ${image },1);
    
  // `;}else{
  //    groups = await prisma.$queryRaw<Group[]>`
  //   INSERT INTO groups (group_name, description, created_by,image,number_of_members)
  //   OUTPUT inserted.*
  //   VALUES (${body.group_name}, ${description}, ${created_by}, null,1);
  //   `
  // }
	const group = groups[0];
    
    
    console.log("created group?>>",group);
    // Add creator as a member with 'admin' role
    if (created_by) {
      await prisma.$executeRaw`
      INSERT INTO group_members(user_id,group_id,role) VALUES
      (${created_by},${group.group_id},'admin');`
    }

    return NextResponse.json(
      { message: 'Group created successfully', group },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating group', error },
      { status: 500 }
    );
  }
}

// PUT update group
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { group_id, group_name, image } = body;

    if (!group_id || !group_name) {
      return NextResponse.json(
        { message: 'Group ID and name are required' },
        { status: 400 }
      );
    }

    const updatedGroup = await prisma.groups.update({
      where: {
        group_id: Number(group_id),
      },
      data: {
        group_name,
        image,
      },
    });

    return NextResponse.json(
      { message: 'Group updated successfully', group: updatedGroup },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating group' },
      { status: 500 }
    );
  }
}

// DELETE group
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { group_id } = body;

    if (!group_id) {
      return NextResponse.json(
        { message: 'Group ID is required' },
        { status: 400 }
      );
    }

    // First delete all group members
    await prisma.group_members.deleteMany({
      where: {
        group_id: Number(group_id),
      },
    });

    // Then delete the group
    await prisma.$executeRaw`
    DECLARE @group_id INT = ${group_id}; -- Thay 123 bằng giá trị group_id bạn muốn xóa

-- Xóa thành viên nhóm
DELETE FROM group_members WHERE group_id = @group_id;

-- Xóa bình luận liên quan đến bài viết trong nhóm
DELETE FROM comments WHERE post_id IN (
    SELECT post_id FROM posts WHERE group_id = @group_id
);

-- Xóa phản ứng liên quan đến bài viết và bình luận trong nhóm
DELETE FROM reactions WHERE post_id IN (
    SELECT post_id FROM posts WHERE group_id = @group_id
) OR comment_id IN (
    SELECT comment_id FROM comments WHERE post_id IN (
        SELECT post_id FROM posts WHERE group_id = @group_id
    )
);

-- Xóa bài viết trong nhóm
DELETE FROM posts WHERE group_id = @group_id;

-- Xóa nhóm
DELETE FROM groups WHERE group_id = @group_id;
    `

    return NextResponse.json(
      { message: 'Group deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json(
      { message: 'Error deleting group',
        error
       },

      { status: 500 }
    );
  }
} 