"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  UserCircleIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
                SocialHub
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "text-indigo-400 bg-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:shadow-sm"
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link> */}
            {/* <Link
              href="/users"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/users")
                  ? "text-indigo-400 bg-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:shadow-sm"
              }`}
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link
              href="/groups"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/groups")
                  ? "text-indigo-400 bg-gray-800 shadow-sm"
                  : "text-gray-400 hover:text-indigo-400 hover:bg-gray-800 hover:shadow-sm"
              }`}
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Groups</span>
            </Link>*/}
          </nav> 

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="hidden md:block">
                    <p className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Hello, {session.user?.username  }
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    router.push('/')
                    await signOut()
                    
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-sm"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <p className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Hello, guest
                    </p>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-400 border border-indigo-600 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-sm"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:shadow-md"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
