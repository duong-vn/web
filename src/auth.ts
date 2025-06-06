import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials"
import { postLogin } from './app/services/apiServices';

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
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
          user_id: data.user.user_id,
          email: data.user.email,
          role: data.user.role,
          full_name: data.user.full_name,
          username: data.user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT token before", token);
      // console.log("JWT user before", user);

      if (user) {
        token.user_id = user.user_id;
        token.role = user.role;
        token.email = user.email; // thường email đã có sẵn nhưng bạn muốn chắc chắn
        token.full_name = user.full_name;
        token.username = user.username;
      
      }
      //  console.log("JWT token after", token);
      // console.log("JWT user after", user);
      return token;
    },
    async session({ session, token }) {
      // console.log("Session before", session);
      // console.log("Token before", token);

      if (token) {
        session.user.user_id = token.user_id as number;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.full_name = token.full_name as string;
        session.user.username = token.username as string;
        
      }
      // console.log("Session after", session);
      // console.log("Token after", token);
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
  
