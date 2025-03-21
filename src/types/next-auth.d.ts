import { DefaultSession, DefaultUser } from "next-auth";
import { UserClient, View } from "./user.types";
declare module "next-auth" {
  interface Session extends DefaultSession {
    access: string;
    refresh: string;
    error?: string;
    user: UserClient & DefaultSession["user"];
  }
  interface User extends DefaultUser, UserClient {
    access: string;
    refresh: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    access: string;
    refresh: string;
    user: UserClient;
    error?: string;
  }
}
