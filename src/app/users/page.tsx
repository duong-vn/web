"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import ModalCreateUser from "./ModalCreateUser";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR<User[]>("/api/users", fetcher);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No users found</div>;

  return (
    <div className="p-4 ml-64 h-[calc(100vh-64px)] mt-16">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100">Users</h1>
          <p className="text-gray-400">Manage your community members</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {data.map((user: User) => (
                  <tr key={user.user_id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {user.image ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.image}
                              alt={user.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-300 text-sm font-medium">
                                {user.full_name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {user.full_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      @{user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {session?.user?.role === "admin" ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleOpenUpdateModal(user)}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button className="text-indigo-400 hover:text-indigo-300">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalCreateUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {selectedUser && (
        <>
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
        </>
      )}
    </div>
  );
}
