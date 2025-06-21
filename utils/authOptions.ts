import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from "jwt-decode";
import AxiosApp from '@/lib/axios';

export const auth: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "weomowedmowe",
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        login: { label: 'Phone', type: 'text', placeholder: 'Enter Phone Number' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        const dataLogin = {
          identifier: credentials?.login,
          password: credentials?.password
        };
        
        try {
          const res = await AxiosApp.post('/auth/local', dataLogin);
          if (res?.data?.jwt) {
            const user: {token: string, data: any}= {
              token: "",
              data: "",
            };
            user.token = res.data.jwt as string
            user.data = res.data.user as any
            return user as any;
          }
        } catch (e: any) {          
          const errorMessage = e?.response?.data?.message ||  e?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        username: { label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' },
      },
      async authorize(credentials) {
        try {
          const registerData = {
            username: credentials?.username,
            email: credentials?.email,
            password: credentials?.password,
          };            
          const res = await AxiosApp.post('/auth/local/register', registerData);
          if (res?.data?.jwt) {
            const user: {token: string, data: any}= {
              token: "",
              data: ""
            };
            user.token = res.data.jwt as string
            user.data = res.data.user as any
            return user as any;
          }
         
        } catch (e: any) {  
          const errorMessage = e?.response?.data?.message || e?.message || 'Something went wrong!';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user) {
        // When the user logs in, store token and other data in the JWT
        token.token = user.token;
        token.user = user.data;
      }

      // Optional: Validate token expiration
      // if (token.token) {
      //   const decoded = jwtDecode(token.token);
      //   if (decoded && (decoded.exp as number) < Date.now() / 1000) {
      //     console.log('Token is expired');
      //     // Optionally, handle token refresh here
      //     return {};
      //   }
      // }

      return token;
    },
    session: ({ session, token }: { session: any; token: any }) => {
      if (token && token.token) {
        
        session.token = token.token;
        session.user = token.user;

        // Set session expiration based on expires_at
        // if (token.expires        _at) {
        //   const expiresAt = new Date(token.expires_at);
        //   if (!isNaN(expiresAt.getTime())) {
        //     session.expires = expiresAt.toISOString(); // Set session expiration
        //   }
        // }
      } else {
        // If token is invalid or missing, return an empty session
        session.user = {};
        session.token = null;
        // session.expires = new Date(0).toISOString(); // Set to expired
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};