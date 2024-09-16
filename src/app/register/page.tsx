"use client";

import {
     Button,
     DatePicker,
     Input,
     Select,
     SelectItem,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";
import { User } from "@/app/interface/User";
import {
     parseDate,
     CalendarDate,
     toCalendarDate,
} from "@internationalized/date";
import bcrypt from "bcryptjs";

const genders = [
     {
          id: 1,
          type: "Male",
     },
     {
          id: 2,
          type: "Female",
     },
     { id: 3, type: "ETC." },
];

const Register = () => {
     const [formRegister, setFormRegister] = useState<User>({
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          gender: 1,
          birthDate: parseDate("2000-01-01"),
     });
     const [error, setError] = useState("");
     const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (formRegister.password !== formRegister.confirmPassword) {
               setError("Password not match");
               return;
          }
          try {
               // Hash the password before sending it to the API
               const hashedPassword = await bcrypt.hash(
                    formRegister.password,
                    10
               );
               const formRegisterWithHashedPassword = {
                    ...formRegister,
                    password: hashedPassword,
               };

               // Send the registration request to the API
               const res = await fetch("http://localhost:3000/api/register", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formRegisterWithHashedPassword),
               });

               if (res.ok) {
                    const usersResponse = await fetch("/mocks/users.json");
                    const users = await usersResponse.json();
                    localStorage.setItem("users", JSON.stringify(users));
                    setFormRegister({
                         email: "",
                         phone: "",
                         password: "",
                         confirmPassword: "",
                         firstName: "",
                         lastName: "",
                         gender: 1,
                         birthDate: parseDate("2000-01-01"),
                    } as User);

                    setError("");
                    console.log("Registration successful");
               } else {
                    const errorData = await res.json();
                    setError(errorData.message || "Registration failed");
                    console.log("Registration failed:", errorData);
               }
          } catch (error) {
               console.error("Register failed:", error);
               setError("An error occurred during registration");
          }
     };

     const handleInputChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
     ) => {
          const { name, value } = e.target;
          setFormRegister((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const genderId = Number(e.target.value); // Convert the selected value to a number
          setFormRegister((prev) => ({
               ...prev,
               gender: genderId, // Update the gender in the form state
          }));
     };

     const handleDateChange = (calendarDate: CalendarDate | null) => {
          setFormRegister((prev) => ({
               ...prev,
               birthDate: calendarDate || parseDate(new Date().toISOString()), // Use current date if calendarDate is null
          }));
     };

     return (
          <div className="flex w-full h-screen bg-[#1a1919] justify-center items-center">
               <div className="flex flex-row bg-black w-3/4 h-3/4 rounded-3xl overflow-hidden">
                    <div className="flex flex-col justify-between w-full bg-white rounded-l-3xl h-full text-black p-8 min-w-36 overflow-y-auto">
                         <form onSubmit={handlerSubmit}>
                              <div className="flex flex-col justify-items-start w-full h-full">
                                   <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-3">
                                        <Input
                                             isRequired
                                             type="email"
                                             label="Email"
                                             name="email"
                                             value={formRegister.email}
                                             onChange={handleInputChange}
                                             placeholder="you@example.com"
                                             labelPlacement="outside"
                                        />
                                        <Input
                                             isRequired
                                             label="Phone"
                                             name="phone"
                                             placeholder="099-9999999"
                                             labelPlacement="outside"
                                             value={formRegister.phone}
                                             onChange={handleInputChange}
                                             startContent={
                                                  <div className="pointer-events-none flex items-center">
                                                       <span className="text-default-400 text-small">
                                                            Tel.
                                                       </span>
                                                  </div>
                                             }
                                        />
                                   </div>
                                   <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-3">
                                        <Input
                                             isRequired
                                             type="password"
                                             label="Password"
                                             name="password"
                                             value={formRegister.password}
                                             onChange={handleInputChange}
                                             placeholder="*********"
                                             labelPlacement="outside"
                                        />
                                   </div>
                                   <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-3">
                                        <Input
                                             isRequired
                                             value={
                                                  formRegister.confirmPassword
                                             }
                                             onChange={handleInputChange}
                                             type="password"
                                             name="confirmPassword"
                                             label="Confirm Password"
                                             placeholder="*********"
                                             labelPlacement="outside"
                                        />
                                   </div>

                                   <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-3">
                                        <Input
                                             isRequired
                                             type="string"
                                             label="First Name"
                                             name="firstName"
                                             value={formRegister.firstName}
                                             onChange={handleInputChange}
                                             placeholder="Alex"
                                             labelPlacement="outside"
                                        />
                                        <Input
                                             isRequired
                                             name="lastName"
                                             value={formRegister.lastName}
                                             onChange={handleInputChange}
                                             type="string"
                                             label="Last Name"
                                             placeholder="Mc"
                                             labelPlacement="outside"
                                        />
                                   </div>
                                   <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 py-3">
                                        <Select
                                             isRequired
                                             label="Gender"
                                             value={formRegister.gender}
                                             onChange={handleGenderChange}
                                             labelPlacement="outside"
                                             placeholder="Select a gender"
                                             defaultSelectedKeys={["Male"]}
                                             className="max-w-xs w-2/4"
                                        >
                                             {genders.map((gender) => (
                                                  <SelectItem key={gender.id}>
                                                       {gender.type}
                                                  </SelectItem>
                                             ))}
                                        </Select>
                                        <DatePicker
                                             label="Birth date"
                                             value={formRegister.birthDate}
                                             onChange={handleDateChange}
                                             labelPlacement="outside"
                                             className="w-3/4"
                                             dateInputClassNames={{
                                                  input: "text-black", // Apply custom class to the input field
                                             }}
                                        />
                                   </div>
                              </div>

                              <div className="flex justify-center w-full items-center">
                                   <Button
                                        type="submit"
                                        radius="full"
                                        className="w-3/4 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mr-4"
                                   >
                                        Sign Up
                                   </Button>
                                   <Link href="/login">
                                        <Button
                                             radius="full"
                                             className="bg-black text-white w-1/4"
                                        >
                                             <span
                                                  className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-yellow-500 text-gray-700 rounded-full p-[2px]"
                                                  aria-hidden="true"
                                             >
                                                  <span className="flex items-center justify-center h-full w-full bg-white  rounded-full">
                                                       Cancel
                                                  </span>
                                             </span>
                                        </Button>
                                   </Link>
                              </div>
                         </form>
                    </div>

                    <div
                         className="flex flex-row w-3/4 h-full justify-center items-center p-4 bg-cover bg-center text-center"
                         style={{
                              backgroundImage:
                                   "url('/assets/bg/cool-background.png')", // Corrected the quotes
                         }}
                    >
                         <span className="text-6xl font-bold text-white">
                              REGISTER
                         </span>
                    </div>
               </div>
          </div>
     );
};

export default Register;
