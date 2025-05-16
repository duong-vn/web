'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Group {
  group_id: number;
  group_name: string;
  description: string;
  created_at: string;
  created_by: number;
  is_private: boolean;
  group_members: {
    users: {
      username: string;
      full_name: string;
    };
    role: string;
  }[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        console.log(data);
        setGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Link 
          href="/groups/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Group
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
        
          <Link 
            key={group.group_id} 
            href={`/groups/${group.group_id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{group.group_name}</h2>
                {group.is_private && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    Private
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                
                <div>
                  Created {new Date(group.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No groups found</p>
          <p className="text-gray-400 mt-2">Be the first to create a group!</p>
        </div>
      )}
    </div>
  );
}
