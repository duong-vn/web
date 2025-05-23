'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import GroupCard from './GroupCard';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import ModalCreateGroup from './ModalCreateGroup';
import { group } from 'console';

const fetcher = (url: string) => fetch(url).then(res => res.json());
export default function GroupsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: groups = [], isLoading, error } = useSWR('api/groups', fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false
    });
    const { data: session } = useSession();

    return (
      <div className="p-4 ml-64 my-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Groups</h1>
            <p className="text-emerald-600">Join communities and connect with others</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Group
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border rounded p-4 animate-pulse">
                <div className="h-48 bg-emerald-100 rounded mb-4"></div>
                <div className="h-6 bg-emerald-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-emerald-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group: Group) => (
              <GroupCard key={group.group_id} group={group} />
            ))}
          </div>
        )}

        <ModalCreateGroup 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          created_by={session?.user.user_id || null}
        />
      </div>
    );
}
