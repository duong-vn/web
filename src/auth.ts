import NextAuth from 'next-auth';
import Credentials from "next-auth/providers/credentials"
import { postLogin } from './app/services/apiServices';
export const { handlers ,signIn, signOut,auth } = NextAuth({
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
        let user 
          const res  = await postLogin(String(credentials.email), String(credentials.password))
        user = await res.json()
        
       
            //call backend to authenticate user 
      
        
                



        
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
],
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user_id = user.user_id;
      token.role = user.role;
      token.email = user.email; // thường email đã có sẵn nhưng bạn muốn chắc chắn
    }
    return token;
  },
  async session({ session, token }) {
    if (token) {
      session.user.user_id = token.user_id as number;
      session.user.role = token.role as string;
      session.user.email = token.email as string;
    }
    return session;
  },
},
pages: {
  signIn: "/login",
},
})
  
