import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials"
import { postLogin } from './app/services/apiServices';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          console.log("Credentials:", credentials);
          

          const res = await postLogin(String(credentials.email), String(credentials.password));
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Authentication failed");
          }

          if (!data.user) {
            throw new Error("Invalid credentials");
          }

          return data.user;
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session before:', session);
      console.log('Token:', token);

      if (token) {
        session.user = {
          ...session.user,
          user_id: token.user_id as number,
          role: token.role as string,
          email: token.email as string,
        };
      }

      console.log('Session after:', session);
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});
  
