"use client";

import { useSession } from "next-auth/react";
import React from "react";
import Navbar from "../components/Navbar";
import TableUser from "../components/TableUser";
import { ThemeProvider } from "../themeProvider";

const Dashboard = () => {
     const { data: session, status } = useSession();

     // Debugging output
     console.log("Session Data:", session);
     console.log("Session Status:", status);

     return (
          <ThemeProvider
               enableSystem={true}
               attribute="class"
               defaultTheme="dark"
          >
               <div className="w-full h-screen">
                    <Navbar />
                    <div className="flex h-screen w-full bg-white p-8">
                         <div className="flex w-full h-fit bg-[#1B1B1B] p-6 rounded-3xl shadow-xl">
                              <TableUser />
                         </div>
                    </div>
               </div>
          </ThemeProvider>
     );
};

export default Dashboard;
