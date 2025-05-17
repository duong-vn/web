'use client';

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/"
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Login successful!");
               
            }
        } catch (error: any) {
            console.error("Error during signIn:", error);
            toast.error(error.message || "An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl font-bold">Login</h1>
            <form onSubmit={handleLogin} className="mt-4 space-y-4 w-full max-w-md">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded pr-10"
                        required
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
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}