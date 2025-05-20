'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import GroupCard from './GroupCard';
import useSWR from 'swr';
import { groups } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then(res => res.json());
export default function GroupsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data : groups = [] , isLoading, error } = useSWR('http://localhost:3000/api/groups', fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false
    });


console.log("check group >>",groups);
  return (
    <div className="ml-64 mt-16 p-6 min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">Join communities and connect with others</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Group
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group : Group) => (
          <GroupCard key={group.group_id} group={group} />
        ))}
      </div>

      {/* Create Group Modal - Add your modal component here */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Add your modal content here */}
        </div>
      )}
    </div>
  );
}
