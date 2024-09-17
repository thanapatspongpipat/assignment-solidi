import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
     const token = await getToken({ req, secret: process.env.AUTH_SECRET ? process.env.AUTH_SECRET : 'nextauth'});   
     console.log(token);
       
     const loginUrl = new URL("/login", req.url);
     const dashboardUrl = new URL("/dashboard", req.url);


     if (!token && !req.nextUrl.pathname.startsWith("/login")) {
          return  NextResponse.redirect(loginUrl)
     }
     if (token && req.nextUrl.pathname === "/login") {
          return NextResponse.redirect(dashboardUrl);
     }

     return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  
     matcher: ["/dashboard/:path*", "/login"], // Adjust paths as needed
};
