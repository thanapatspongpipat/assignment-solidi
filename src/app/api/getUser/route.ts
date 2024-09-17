import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "../../interface/User";
import path from "path";
import fs from "fs";
import { getToken } from "next-auth/jwt";

interface Login {
     email: string;
     password: string;
}

async function getUserByEmail(email: string): Promise<User | undefined> {
     const filePath = path.resolve(
          process.cwd(),
          "public",
          "mocks",
          "users.json"
     );
     let users: User[] = [];
     if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          users = JSON.parse(fileContent);
     }

     return users.find((user) => user.email === email);
}

export async function POST(req: any, res: any) {
     try {
          const formLogin = await req.json();
          const user = await getUserByEmail(formLogin.email);

          if (!user) {
               return NextResponse.json({
                    message: "User not found.",
                    status: 404,
               });
          }

          return NextResponse.json({
               data: user,
               message: "",
               status: 500,
          });
     } catch (error) {
          console.error("Error:", error);
          return NextResponse.json({
               message: "Search failed.",
               status: 500,
          });
     }
}
