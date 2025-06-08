"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import ModalCreateUser from "./ModalCreateUser";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { useSession } from "next-auth/react";
import Loading from "@/components/layout/Loading";
import { USER_IMAGE } from "../utils/constants";
import { useRouter } from "next/navigation";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: session,status } = useSession();
  const { data, error, isLoading } = useSWR<User[]>("/api/users", fetcher);
  const router = useRouter();

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
  const redirectUser = (user_id:number)=> {
    router.push(`/users/${user_id}`)

  }
  if(status == 'unauthenticated' ){
    window.location.href='/'
    
}

  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <Loading/>;
  if (!data) return <div>No users found</div>;
 

  return (
    <div className="p-4 ml-64  mt-16 overflow-hidden">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Users</h1>
            <p className="text-gray-400">Manage your community members</p>
          </div>
          {session?.user?.role === 'admin' && (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create User
            </button>
          )}
        </div>

        <div className="p-6">
          {/* <div className="mb-6">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div> */}

          <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Profile
                  </th>
                 {session?.user?.role === 'admin'&& <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Full Name
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
                  <tr key={user.user_id} className="hover:bg-gray-700/50 " >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" >
                        <div className="h-10 w-10 flex-shrink-0" >
                         
                            <img
                              className="h-10 w-10 rounded-full object-cover cursor-pointer"
                              onClick={()=>redirectUser(user.user_id)}
                              src={user.image || USER_IMAGE}
                              alt={user.full_name}
                            />
                         
                         
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100 cursor-pointer hover:text-indigo-400" 
                          onClick={()=>redirectUser(user.user_id)}>
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    {session?.user?.role === 'admin'&& <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.full_name}
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
                        <button className="text-indigo-400 hover:text-indigo-300" onClick={() => handleOpenUpdateModal(user)}>
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
