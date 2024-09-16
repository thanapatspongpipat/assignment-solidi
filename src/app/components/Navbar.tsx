import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "../interface/User";

const Navbar = () => {
     const { data: session, status } = useSession(); // Added status
     const [userData, setUserData] = useState<User | null>(null);
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(true); // Add loading state

     useEffect(() => {
          const fetchUserData = async () => {
               if (session?.user?.email) {
                    setLoading(true); // Set loading to true when fetching starts
                    try {
                         const response = await fetch("/api/getUser", {
                              method: "POST",
                              headers: {
                                   "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                   email: session.user.email,
                              }),
                         });

                         if (!response.ok) {
                              throw new Error("Network response was not ok");
                         }

                         const userData = await response.json();
                         console.log(userData);

                         setUserData(userData.data);
                    } catch (err) {
                         setError("Failed to fetch user data");
                         console.error(err);
                    } finally {
                         setLoading(false); // Set loading to false when fetching completes
                    }
               } else {
                    setLoading(false); // Set loading to false if no email is available
               }
          };

          fetchUserData();
     }, [session?.user?.email]);

     // if (status === "loading" || loading) {
     //      return <div className="text-white">Loading...</div>; // Loading state
     // }

     return (
          <nav className="bg-[#252525]  flex flex-row w-full h-16 justify-between items-center p-9 shadow-lg sticky top-0 z-50">
               <div className="w-full text-white">
                    <span className="text-xl">
                         <a href="/dashboard">SOLIDITHAI CO.</a>
                    </span>
               </div>
               <div className="flex flex-row">
                    {!session ? (
                         <>
                              <div>
                                   <Link href="/login">
                                        <Button
                                             radius="full"
                                             className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mr-4"
                                        >
                                             Sign In
                                        </Button>
                                   </Link>
                              </div>
                              <div>
                                   <Link href="/register">
                                        <Button
                                             radius="full"
                                             className="bg-black text-white"
                                        >
                                             <span
                                                  className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-full p-[2px]"
                                                  aria-hidden="true"
                                             >
                                                  <span className="flex items-center justify-center h-full w-full bg-black rounded-full">
                                                       Register
                                                  </span>
                                             </span>
                                        </Button>
                                   </Link>
                              </div>
                         </>
                    ) : (
                         <>
                              <div className="text-white mr-4 whitespace-nowrap items-center flex flex-row">
                                   {loading
                                        ? "Loading user data..."
                                        : userData
                                        ? `Welcome, ${userData.firstName} ${userData.lastName}`
                                        : "User data not available"}
                              </div>
                              <div>
                                   <Button
                                        radius="full"
                                        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white"
                                        onClick={() => signOut()}
                                   >
                                        Log Out
                                   </Button>
                              </div>
                         </>
                    )}
               </div>
          </nav>
     );
};

export default Navbar;
