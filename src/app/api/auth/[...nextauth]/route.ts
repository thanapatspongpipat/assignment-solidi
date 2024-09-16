import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { User } from "@/app/interface/User";

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
               async authorize(credentials, req) {
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
     secret: process.env.AUTH_SECRET,
     pages: {
          signIn: "/login",
     },
     callbacks: {
          async session({ session, token }) {
               console.log("Session Callback:", session, token);
               return session;
          },
          async jwt({ token }) {
               console.log("JWT Callback:", token);
               return token;
          },
     },
};

export const handlers = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
