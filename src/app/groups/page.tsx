'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import GroupCard from './GroupCard';

// Mock data - replace with actual API call
const mockGroups = [
  {
    id: 1,
    name: 'Web Development',
    description: 'A group for web developers to share knowledge and experiences.',
    memberCount: 156,
    postCount: 89,
    createdAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80'
  },
  {
    id: 2,
    name: 'UI/UX Design',
    description: 'Share and discuss UI/UX design trends, tools, and best practices.',
    memberCount: 243,
    postCount: 156,
    createdAt: '2024-02-01'
  },
  {
    id: 3,
    name: 'Mobile Development',
    description: 'Everything about mobile app development, from iOS to Android.',
    memberCount: 189,
    postCount: 112,
    createdAt: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  // Add more mock groups as needed
];

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {mockGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
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
