import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(
            `${process.env.API_BACKENDL_URL}/api/auth/login/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const data = await res.json();
          console.log("DATA", data);
          if (res.ok && data.user) {
            return {
              ...data.user,
              access: data.access,
              refresh: data.refresh,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          access: user.access,
          refresh: user.refresh,
        };
      }
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const tokenData = JSON.parse(atob(token.access.split(".")[1]));
      if (tokenData.exp < currentTimestamp) {
        try {
          const response = await fetch(
            `${process.env.API_BACKENDL_URL}/api/auth/token/refresh/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: token.refresh }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            token.access = data.access;
            token.refresh = data.refresh;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          return { ...token, error: "RefreshaccessError" };
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.access = token.access;
      session.error = token.error;
      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};
