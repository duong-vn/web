import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Mở rộng kiểu User để có role
declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // hoặc kiểu phù hợp bạn dùng
      user_id?: number;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string ;
    user_id?: number;
    email?: string;

  }

  interface JWT {
    role?: string ;
    user_id?: number;
    email?: string;
  }
}
