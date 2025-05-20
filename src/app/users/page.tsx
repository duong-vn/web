'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import UserCard from './UserCard';
import useSWR from 'swr';
import ModalCreateUser from './ModalCreateUser';
import ModalUpdateUser from './ModalUpdateUser';
import ModalDeleteUser from './ModalDeleteUser';
import { useSession } from 'next-auth/react';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const { data, isLoading, error } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false
  });
const { data: session } = useSession();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user);
  };

  const handleOpenUpdateModal = (user: User) => {
    setIsUpdateModalOpen(true);
    setSelectedUser(user);
  };

  if (error) return (
    <div className="ml-64 mt-16 p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load users. Please try again later.</span>
      </div>
    </div>
  );
 
  return (
    <div className="ml-64 mt-16 p-6 min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
    
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your system users</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          disabled={session?.user?.role !== 'admin'}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {session?.user?.role !== 'admin'?'You must be admin to add user' : 'Add New User'}
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
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

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((user: User) => (
            <UserCard
              key={user.user_id}
              user={user}
              onEdit={handleOpenUpdateModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ModalCreateUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ModalUpdateUser 
        isModalOpen={isUpdateModalOpen} 
        setIsModalOpen={setIsUpdateModalOpen} 
        user={selectedUser} 
        setUser={setSelectedUser} 
      />
      <ModalDeleteUser 
        show={isDeleteModalOpen} 
        setShow={setIsDeleteModalOpen} 
        user={selectedUser} 
        setUser={setSelectedUser} 
      />
    </div>
  );
}
