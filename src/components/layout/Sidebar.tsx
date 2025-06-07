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
  ChevronRightIcon,
  DocumentTextIcon
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
    { name: 'Posts', href: '/posts', icon: DocumentTextIcon, show: true },
    { name: 'Users', href: '/users', icon: UsersIcon, show: isAdmin },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon, show: isAuthenticated },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, show: isAuthenticated },
  ];

  // Return loading state if not mounted
  if (!mounted) {
    return (
      <div className="fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 w-64">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-800"></div>
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40">
      <div className={`h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-gray-800 border border-gray-700 rounded-full p-1.5 shadow-sm hover:bg-gray-700 transition-all duration-200 hover:scale-110 z-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Logo/Brand */}
        <div className="p-6">
          <h1 className={`text-xl font-semibold text-gray-100 transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            SocialHub
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              if (!item.show) return null;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gray-800 text-gray-100' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="font-medium">
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
        {session && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-300">
                  {session.user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {session.user?.email}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {session.user?.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 