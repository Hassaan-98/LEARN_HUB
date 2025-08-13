import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "../../../../lib/db";
import { users } from "../../../../lib/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName?: string;
    lastName?: string;
    userType?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      userType?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string;
    lastName?: string;
    userType?: string;
  }
}

declare module "next-auth/providers" {
  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                // Don't hardcode userType here; will override in signIn callback
                userType: undefined,
                firstName: profile.given_name || "",
                lastName: profile.family_name || "",
              };
            },
          }),
        ]
      : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          image: user.profilePhoto || undefined,
        };
      },
    }),
  ],

  callbacks: {
    // On sign in - create or update user with userType from URL params
    async signIn({ user, account, profile, email, credentials }) {
      let userTypeFromParams: string | undefined;

      // Extract userType from callback URL query params (Google provider)
      if (account?.provider === "google" && account.callbackUrl) {
         try {
    const url = new URL(account.callbackUrl as string);
    userTypeFromParams = url.searchParams.get("userType") || undefined;
  } catch {
          // ignore URL parse errors
        }
      }

      // If userType is not provided, default to "student"
      const userType = userTypeFromParams || "student";

      if (account?.provider === "google") {
        try {
          // Check if user exists
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (!existingUser) {
            // Create new user with userType from Google login selection
            await db.insert(users).values({
              id: uuidv4(),
              email: user.email!,
              firstName: user.firstName || (profile as any)?.given_name || "",
              lastName: user.lastName || (profile as any)?.family_name || "",
              userType,
              password: "",
              profilePhoto: user.image,
            });
          } else if (existingUser.userType !== userType) {
            // Optionally update userType if changed (or skip)
            await db
              .update(users)
              .set({ userType })
              .where(eq(users.email, user.email!));
          }
        } catch (error) {
          console.error("Error creating/updating Google user:", error);
          return false;
        }
      }

      return true;
    },

    // Add userType, firstName, lastName to JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.userType = user.userType;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      } else if (account?.provider === "google") {
        try {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email!))
            .limit(1);

          if (dbUser) {
            token.userType = dbUser.userType;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return token;
    },

    // Add userType, firstName, lastName to session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || "";
        session.user.userType = token.userType || "student";
        session.user.firstName = token.firstName || "";
        session.user.lastName = token.lastName || "";
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
