import NextAuth from "next-auth";

interface Auth {
  user?: {
    name?: string;
    email?: string;
    // any other fields for the user
  };
}

export const authConfig:any = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: Auth; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
};

export const { signIn, signOut, handlers } = NextAuth(authConfig);
