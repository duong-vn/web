import NextAuth, { AuthOptions, User, Session } from 'next-auth';
import Credentials from "next-auth/providers/credentials"
import { JWT } from 'next-auth/jwt';
import { postLogin } from './app/services/apiServices';

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    user_id: number;
    role?: string;
    username?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      user_id?: number;
      role?: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    user_id?: number;
    role?: string;
    username?: string;
  }
}

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials)=> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        const res = await postLogin(String(credentials.email), String(credentials.password))
        let data = await res.json()
        
        console.log("User in auth.ts", data.user);
        //call backend to authenticate user 
      
        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }
        
        if (!data.user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
        
        // return user object with their profile data
        return {
          id: data.user.user_id.toString(),
          user_id: Number(data.user.user_id),
          email: data.user.email,
          role: data.user.role,
          name: data.user.full_name,
          username: data.user.username,
        } satisfies User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: User | null }) {
      if (user) {
        token.id = user.id;
        token.user_id = Number(user.user_id);
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          user_id: Number(token.user_id),
          role: token.role,
          email: token.email,
          name: token.name,
          username: token.username,
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: true, // Thêm debug để xem lỗi chi tiết hơn
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
  
