import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { User } from "@/app/interface/User";
import { getToken } from "next-auth/jwt";

interface Login {
     email: string;
     password: string;
}

const usersPath = path.join(process.cwd(), "public", "mocks", "users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

const authOptions: NextAuthOptions = {
     providers: [
          CredentialsProvider({
               name: "credentials",
               credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
               },
               async authorize(credentials, req: any) {
                    if (!credentials) {
                         return null;
                    }
                    const user = users.find(
                         (user: User) => user.email === credentials.email
                    );
                    console.log(user);
                    console.log(process.env.NEXTAUTH_SECRET);

                    if (!user) {
                         return null;
                    }

                    const isMatch = await bcrypt.compare(
                         credentials.password,
                         user.password
                    );

                    console.log(isMatch);

                    if (isMatch) {
                         return user;
                    }

                    return null;
               },
          }),
     ],
     session: {
          strategy: "jwt",
     },
     secret: process.env.AUTH_SECRET ? process.env.AUTH_SECRET : 'nextauth',
     pages: {
          signIn: "/login",
     },
     callbacks: {
          async jwt({ token, user }) {
              if (user) {
                  token.email = user.email;
                  token.id = user.id;  // Or any other identifier you use
              }
              console.log("JWT Callback:", token); // Add logs for debugging
              return token;
          },
          async session({ session, token }) {
              session.user = {
                  ...session.user,
                  email: token.email,
              };
              console.log("Session Callback:", session); // Debug logs
              return session;
          },
      },
};

export const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
