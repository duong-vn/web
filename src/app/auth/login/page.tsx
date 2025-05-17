'use client';

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react"
export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
       console.log("Login clicked", email, password);
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
       
        console.log("Login response", res);
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