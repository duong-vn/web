'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Handle initial state and hydration
  useEffect(() => {
    // Get saved state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
    setMounted(true);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    }
  }, [isCollapsed, mounted]);

  const isAuthenticated = status === 'authenticated';
  // const isAdmin = session?.user?.role === 'admin';
  const isAdmin = true;
  const menuItems = [
    { name: 'Home', href: '/', icon: HomeIcon, show: true },
    { name: 'Posts', href: '/posts', icon: UserGroupIcon, show: true },
    { name: 'Users', href: '/users', icon: UsersIcon, show: isAdmin },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon, show: isAuthenticated },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, show: isAuthenticated },
  ];

  // Return loading state if not mounted
  if (!mounted) {
    return (
      <div className="fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 w-64">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-700/50"></div>
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-all duration-500 z-40">
      <div className={`h-full transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-gray-800 border border-gray-700 rounded-full p-1.5 shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 z-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-300" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-300" />
          )}
        </button>

        {/* Logo/Brand */}
        <div className="p-6">
          <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            MyWebsite
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              if (!item.show) return null;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-gray-300 hover:bg-gray-700/50'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isActive ? 'opacity-100' : ''}`}></div>
                    <item.icon className={`h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="relative z-10 font-medium transition-all duration-300 group-hover:translate-x-1">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {isAuthenticated && !isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-xl backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-medium">
                  {session.user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {session.user?.email}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {session.user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 