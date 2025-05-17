'use client';

import { motion } from 'framer-motion';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface UserCardProps {
  user: {
    user_id: number;
    full_name: string;
    email: string;
    username: string;
    gender: string;
    image?: string;
    phone?: string;
    location?: string;
  };
  onEdit?: (user: any) => void;
  onDelete?: (user: any) => void;
}

const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* User Header */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {user.image ? (
          <img
            src={user.image}
            alt={user.full_name}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover"
          />
        ) : (
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center">
            <UserCircleIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="pt-12 pb-6 px-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-1">
          {user.full_name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          @{user.username}
        </p>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <PhoneIcon className="h-5 w-5 mr-2 text-purple-500" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPinIcon className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm">{user.location}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user)}
              className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard; 