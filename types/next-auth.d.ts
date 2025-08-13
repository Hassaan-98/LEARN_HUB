import type { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

// Extend the base NextAuth types
declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  }

  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      userType?: string;
    } & DefaultSession["user"];
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string;
    lastName?: string;
    userType?: string;
  }
}

// ✅ Extend the Google provider's Profile type specifically
declare module "next-auth/providers/google" {
  interface GoogleProfile {
    given_name?: string;
    family_name?: string;
  }
}
