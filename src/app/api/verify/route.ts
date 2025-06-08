import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    console.log("Email", email);
    console.log("Password", password);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const validateEmail = (e: string) => {
        return isValidEmail.test(e);
    };
    if (!validateEmail(email)) {
        return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }
    try {
        const users = await prisma.$queryRaw<UserWithRole[]>
        `
                
                    SELECT 
                        u.user_id,
                        u.email,
                        u.full_name,
                        u.username,
                        u.password,
                        u.gender,
                        u.image,                      
                        u.role
                        
                    FROM users u
                
                    WHERE u.email = ${email}
                    
        
        
        
        ` 
        
        const user = users[0];
       
        console.log("User in route api", user);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }
        return NextResponse.json({ message: 'User verified successfully',
            user
         }, { status: 200 });
         
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({ message: 'Internal server error',error }, { status: 401 });
    }
}
