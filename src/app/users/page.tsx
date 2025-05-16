'use client';

import { useState } from 'react';
import { LuImagePlus } from "react-icons/lu";
import ModalCreateUser from './ModalCreateUser';
import UserTable from './UserTable';
import useSWR from 'swr';
import ModalUpdateUser from './ModalUpdateUser';
import ModalDeleteUser from './ModalDeleteUser';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen,setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const { data: users = [], error } = useSWR('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false
  });
  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleOpenDeleteModal = (user:User) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user);
  }
  const handleOpenUpdateModal = (user:User) => {
  setIsUpdateModalOpen(true);
  setSelectedUser(user);
  console.log("check user>>>",user)

}

  if (error) return <div>Failed to load users</div>;
  if (!users) return <div>Loading...</div>;




  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your system users</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <UserTable 
        users={users.sort((a: User, b: User) => b.user_id - a.user_id)} 
        handleOpenModal={handleOpenUpdateModal} 
        handleOpenDeleteModal={handleOpenDeleteModal}
      />

      {/* Modal forEdit */}
      <ModalCreateUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ModalUpdateUser isModalOpen={isUpdateModalOpen} setIsModalOpen={setIsUpdateModalOpen} user = {selectedUser} setUser = {setSelectedUser} />
      <ModalDeleteUser show={isDeleteModalOpen} setShow={setIsDeleteModalOpen} user = {selectedUser} setUser={setSelectedUser} />
    </div>
  );
}
