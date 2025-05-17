'use client'
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
   console.log("session >>> ",session)
   console.log("status >>>",status)
  // Add loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              MyWebsite
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {
           
            session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {session.user?.email}</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  <Link href="/auth/logout">Sign Out</Link>
                </button>
              </div>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                <Link href="/auth/login">Sign In</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 