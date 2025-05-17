import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Mở rộng kiểu User để có role
declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // hoặc kiểu phù hợp bạn dùng
      user_id?: number;
      email?: string;
        full_name?: string;
        username?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string ;
    user_id?: number;
    email?: string;
    full_name?: string;
    username?: string;

  }

  interface JWT {
    role?: string ;
    user_id?: number;
    email?: string;
    full_name?: string;
    username?: string;
  }
}
