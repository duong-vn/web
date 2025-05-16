'use client';

import { useEffect, useState } from 'react';
import { getGroups, deleteGroup } from '../services/apiServices';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import Link from 'next/link';
import ModalDeleteGroup from './ModalDeleteGroup';



export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const fetchGroups = async () => {
    const response = await getGroups();
  console.log("response to fetch group",response);
    if (response.ok) {
      const data = await response.json();
      console.log("data ",data);
      setGroups(data);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDeleteClick = (group: Group) => {

    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGroup) return;

    const response = await deleteGroup(selectedGroup.group_id);
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      mutate('/api/groups');
      setShowDeleteModal(false);
      setSelectedGroup(null);
      fetchGroups();
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Link
          href="/groups/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Group
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group.group_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{group.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(group.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/groups/${group.group_id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </Link>
                  <Link
                    href={`/groups/${group.group_id}/edit`}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(group)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalDeleteGroup
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        group={selectedGroup}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
