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
  const [selectedUser, setSelectedUser] = useState<any>();
  const { data, isLoading, error } = useSWR("/api/users", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
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

  if (error)
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            Failed to load users. Please try again later.
          </span>
        </div>
      </div>
    );

  return (
    <div className="p-4 ml-64 mt-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Users</h1>
          <p className="text-indigo-600">Manage your system users</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          disabled={session?.user?.role !== "admin"}
        >
          {session?.user?.role !== "admin" ? (
            "You must be admin to add user"
          ) : (
            <>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create User
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-indigo-100 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-indigo-50 rounded mb-2"></div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-200 max-h-75 overflow-y-auto">
              {data.map((user: User) => (
                <tr key={user.user_id} className="hover:bg-indigo-50">
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
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 text-sm font-medium">
                              {user.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-900">
                          {user.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                    @{user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenUpdateModal(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {session?.user?.role === "admin" ? "Edit" : "View"}
                      </button>

                      {session?.user?.role === "admin" && (
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalCreateUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
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
