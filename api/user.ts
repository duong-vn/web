import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  if (req.method === 'GET') {
    try {
      // Lấy tất cả người dùng từ cơ sở dữ liệu
      const users: any = await prisma.users.findMany();
      res.status(200).json(users);  // Trả về dữ liệu người dùng
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else {
    // Phản hồi cho các phương thức HTTP khác ngoài GET
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}