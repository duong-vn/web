import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '../../../prisma/node_modules/.prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

interface UserWithPassword {
  user_id: number;
  email: string;
  username: string;
  full_name: string;
  gender: string | null;
  created_at: Date | null;
  password: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        }) as UserWithPassword | null;

        if (!user) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.username
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  pages: {
    signIn: '/login'
  }
};

export default NextAuth(authOptions); 