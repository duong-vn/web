import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { ToastContainer, toast } from 'react-toastify';
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
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
          <Footer />
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
