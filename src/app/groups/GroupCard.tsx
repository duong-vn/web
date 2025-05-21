'use client';

import { motion } from 'framer-motion';
import { UserGroupIcon, DocumentTextIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { deleteGroup } from '../services/apiServices';
import ModalDeleteGroup from './ModalDeleteGroup';

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = group.created_by === session?.user?.user_id;

  const handleDelete = async () => {
    try {
      const res = await deleteGroup(group.group_id);
      const data = await res.json();

      if (res.ok) {
        mutate('api/groups');
        toast.success('Group deleted successfully');
        setShowDeleteModal(false);
      } else {
        toast.error(data.message || 'Error deleting group');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Error deleting group');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Group Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {group.image ? (
            <img
              src={group.image}
              alt={group.group_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserGroupIcon className="h-16 w-16 text-white/50" />
            </div>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Group Info */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {group.group_name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {group.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {group.number_of_members}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Members
              </span>
            </div>
            <div className="flex flex-col items-center">
              <DocumentTextIcon className="h-5 w-5 text-purple-500 mb-1" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {group.number_of_posts}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Posts
              </span>
            </div>
            <div className="flex flex-col items-center">
              <CalendarIcon className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(group.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Created
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
            Join Group
          </button>
        </div>
      </motion.div>

      <ModalDeleteGroup
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        group={group}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default GroupCard; 