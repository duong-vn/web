'use client';

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
    <div className="bg-white border rounded p-4">
      <div className="text-center mb-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.full_name}
            className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-2 bg-gray-200 flex items-center justify-center">
            <UserCircleIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-medium">{user.full_name}</h3>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" />
          <span className="text-sm">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center text-gray-600">
            <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm">{user.phone}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm">{user.location}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(user)}
            className="flex-1 py-2 px-4 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard; 