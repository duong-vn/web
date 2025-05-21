'use client';

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react"
import { toast } from 'react-toastify';

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Invalid email format");
            return;
        }

        try {
            const res = await signIn("credentials", {
                email,
                password,
                // redirectTo:"/"
                redirect: false,
            })
            console.log("res from login", res);
            if (res?.error) {
                toast.error("Invalid credentials");
            } else {
                toast.success("Login successful");
                // Redirect to the home page or any other page
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Login error", error);
            toast.error("An error occurred during login");
        }   
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold">Login</h1>
            <form className="mt-4 space-y-4 w-full max-w-md"> {/* Added w-full max-w-md */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded pr-10"
                    />
                    <button 
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? ( 
                            <EyeSlashIcon className="h-5 w-5"/>
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <button
                    
                    className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </form>
        </div>
    );
}