import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionProvider from "@/components/providers/SessionProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyWebsite",
  description: "Welcome to MyWebsite - Your trusted source for information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-4">
                {children}
              </main>
            </div>
            <ToastContainer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
