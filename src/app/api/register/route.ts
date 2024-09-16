import { User } from "@/app/interface/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
     try {
          const formRegister: User = await req.json();
          delete formRegister.confirmPassword;
          const filePath = path.resolve(
               process.cwd(),
               "public",
               "mocks",
               "users.json"
          );
          let users = [];
          if (fs.existsSync(filePath)) {
               const fileContent = fs.readFileSync(filePath, "utf-8");
               users = JSON.parse(fileContent);
          }
          const emailExists = users.some(
               (user: User) => user.email === formRegister.email
          );
          if (emailExists) {
               return NextResponse.json({
                    message: "Email already registered",
                    status: 400,
               });
          }

          users.push(formRegister);
          fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

          return NextResponse.json({
               message: "Register success",
               status: 200,
          });
     } catch (error) {
          console.error("Error during registration:", error);
          return NextResponse.json({
               message: "Register failed.",
               status: 500,
          });
     }
}
