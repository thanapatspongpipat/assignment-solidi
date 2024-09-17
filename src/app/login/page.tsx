"use client";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

const validateInput = (name: string, value: string) => {
     let isInvalid = false;
     let errorMessage = "";

     switch (name) {
          case "email":
               if (!value) {
                    isInvalid = true;
                    errorMessage = "Email is required";
               } else if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(value)) {
                    isInvalid = true;
                    errorMessage = "Please enter a valid email";
               }
               break;
          case "password":
               if (!value) {
                    isInvalid = true;
                    errorMessage = "Password is required";
               }
               break;
          default:
               break;
     }

     return { isInvalid, errorMessage };
};

function Login() {
     const router = useRouter();
     const [formLogin, setFormLogin] = useState({
          email: "",
          password: "",
     });

     const [errors, setErrors] = useState({
          email: "",
          password: "",
     });

     const [error, setError] = useState("");
     const handleInputChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
     ) => {
          const { name, value } = e.target;
          const { isInvalid, errorMessage } = validateInput(name, value);
          setFormLogin((prev) => ({
               ...prev,
               [name]: value,
          }));

          setErrors((prevState) => ({
               ...prevState,
               [name]: errorMessage,
          }));
     };
     const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const emailValidation = validateInput("email", formLogin.email);
          const passwordValidation = validateInput(
               "password",
               formLogin.password
          );

          if (emailValidation.isInvalid || passwordValidation.isInvalid) {
               setErrors({
                    email: emailValidation.errorMessage,
                    password: passwordValidation.errorMessage,
               });
               return; // Prevent submission if any field is invalid
          }

          try {
               const res = await signIn("credentials", {
                    redirect: false,
                    email: formLogin.email,
                    password: formLogin.password,
               });
               console.log(res);

               if (res?.ok) {
                    // Success alert
                    Swal.fire({
                         title: "Login Successful",
                         text: "You have successfully logged in!",
                         icon: "success",
                         confirmButtonText: "OK",
                    }).then(() => {
                         // Redirect to dashboard after successful login
                         router.push("/dashboard");
                    });
               } else {
                    setError(res?.error || "Login failed");
                    Swal.fire({
                         title: "Login Failed",
                         text: res?.error || "Login failed",
                         icon: "error",
                         confirmButtonText: "OK",
                    });
               }
          } catch (error) {
               setError("An error occurred during login");
               Swal.fire({
                    title: "Error",
                    text: "An error occurred during login",
                    icon: "error",
                    confirmButtonText: "OK",
                });
          }
     };
     return (
          <div className="flex w-full h-screen bg-[#1a1919] justify-center items-center">
               <div className="flex flex-row bg-white w-3/4 h-3/4 rounded-3xl overflow-hidden">
                    <div
                         className="flex flex-row justify-center items-center w-full bg-cover bg-center rounded-l-3xl h-full text-black p-8 min-w-36 overflow-y-auto"
                         style={{
                              backgroundImage:
                                   "url('/assets/bg/cool-background.png')", // Corrected the quotes
                         }}
                    >
                         {" "}
                         <span className="text-6xl font-bold text-white">
                              SIGN IN
                         </span>
                    </div>

                    <div className="w-3/4 h-full p-8 flex flex-col justify-between text-black overflow-y-auto">
                         <form onSubmit={handlerSubmit}>
                              <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-4">
                                   <Input
                                        name="email"
                                        onChange={handleInputChange}
                                        type="email"
                                        label="Email"
                                        placeholder="you@example.com"
                                        labelPlacement="outside"
                                        isInvalid={!!errors.email}
                                        errorMessage={errors.email}
                                   />
                              </div>
                              <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-7">
                                   <Input
                                        name="password"
                                        onChange={handleInputChange}
                                        type="password"
                                        label="Password"
                                        placeholder="*********"
                                        labelPlacement="outside"
                                        isInvalid={!!errors.password}
                                        errorMessage={errors.password}
                                   />
                              </div>
                              <div className="flex justify-center w-full items-center p-6">
                                   <Button
                                        type="submit"
                                        radius="full"
                                        className="w-3/4 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mr-4"
                                   >
                                        Sign In
                                   </Button>
                                   <Link href="/register">
                                        <Button
                                             radius="full"
                                             className="bg-black text-white w-1/4"
                                        >
                                             <span
                                                  className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-yellow-500 text-gray-700 rounded-full p-[2px]"
                                                  aria-hidden="true"
                                             >
                                                  <span className="flex items-center justify-center h-full w-full bg-white  rounded-full">
                                                       Register
                                                  </span>
                                             </span>
                                        </Button>
                                   </Link>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
}

export default Login;
