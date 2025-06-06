import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Helper function to validate base64 image
// const isValidBase64Image = (str: string) => {
//   if (!str) return false;
//   try {
//     // Check if it's a data URL
//     if (str.startsWith('data:image/')) {
//       return true;
//     }
//     // Check if it's a raw base64 string
//     return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(str);
//   } catch (e) {
//     return false;
//   }
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const validateEmail = (e: string) => {
    return isValidEmail.test(e);
  };

  if (req.method === 'GET') {
    try {
      // const users = await prisma.users.findMany({
      //   select: {
      //     user_id: true,
      //     full_name: true,
      //     username: true,
      //     email: true,
      //     gender: true,
      //     image: true,
      //     created_at: true,
          
      //   }
      // });
          const users = await prisma.$queryRaw`
            SELECT *
            FROM users
            Order by user_id DESC
          
          `





      if (!users) {
        return res.status(404).json({ message: 'No users found' });
      }

      // Transform the data to include role from group_members
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { full_name, username, email, password, gender,image } = req.body;
      
     
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
      if (!full_name) {
        return res.status(400).json({ message: 'Full name is required' });
      }
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      if (!gender) {
        return res.status(400).json({ message: 'Gender is required' });
      }

      if(!validateEmail(email)){
        res.status(400).json({message: 'Invalid email'})
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
     const user = await prisma.$queryRaw`
  INSERT INTO users (full_name, username, email, password, gender, image)
  OUTPUT inserted.*
  VALUES (${full_name}, ${username}, ${email}, ${hashedPassword}, ${gender}, ${image??''});
`;
      res.status(201).json({
        message: 'User created successfully',
        user
      });

    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { user_id, username, password, full_name, gender, image } = req.body;

      if (!user_id || !username || !password || !full_name || !gender) {
        res.status(400).json({ message: 'Please fill out the required form' });
        return;
      }

      const newData: any = {};
      newData.image = image || null;
      newData.username = username;
      const hashedPassword = await bcrypt.hash(password,10);

      newData.password = hashedPassword;
      newData.full_name = full_name;

      const theUser = await prisma.users.findUnique({
        where: { user_id }
      });

      if (!theUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await prisma.users.update({
        where: { user_id },
        data: newData
      });

      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }else if ( req.method === 'DELETE') {
    console.log("body delete",req.body);
    try {
      const { user_id } = req.body;
      console.log("User id in delete", user_id);
      if (!user_id) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

   

try {
const sql = `
BEGIN TRANSACTION;
DELETE FROM reactions WHERE user_id = ${user_id};
DELETE FROM comments WHERE user_id = ${user_id};
DELETE FROM posts WHERE user_id = ${user_id};
DELETE FROM group_members WHERE user_id = ${user_id};
UPDATE groups SET created_by = NULL WHERE created_by = ${user_id};
DELETE FROM users WHERE user_id = ${user_id};
COMMIT;
`

await prisma.$executeRawUnsafe(sql);
} catch (error) {
  
  throw error;
}

      res.status(200).json({
        message: 'User and all associated data deleted successfully'
      });

    } catch (error) {
      console.log("Error deleting user:", error);
      res.status(500).json({ message: 'Error deleting user. Please try again.' });
    }
  }
}