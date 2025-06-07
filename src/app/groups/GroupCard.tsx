"use client";

import {
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { deleteGroup, getGroupById } from "../services/apiServices";
import ModalDeleteGroup from "./ModalDeleteGroup";
import { MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { GROUP_IMAGE } from "../utils/constants";

interface GroupCardProps {
  group: Group;
  handleJoinGroup: (groupId: number) => void;
}

export default function GroupCard({ group, handleJoinGroup }: GroupCardProps) {
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState<[]>([]);
  const [groupSet, setGroupSet] = useState<Set<number>>(new Set());

  const handleDelete = async () => {
    try {
      const response = await deleteGroup(group.group_id);
      if (response.ok) {
        toast.success("Group deleted successfully");
        mutate("/api/groups");
      } else {
        toast.error("Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Error deleting group");
    }
  };

  useEffect(() => {
    const getJoinedGroup = async () => {
      try {
        const response = await getGroupById(session?.user?.user_id || 0);
        const data = await response.json();
        setJoinedGroup(data);
        const groupIds = new Set(data.map((group: any) => group.group_id));
        setGroupSet(groupIds as Set<number>);
      } catch (error) {
        console.error("Error fetching joined groups:", error);
      }
    };

    if (session?.user?.user_id) {
      getJoinedGroup();
    }
  }, [session?.user?.user_id]);

  const handleClickGroup = () => {
    window.location.href = `/groups/${group.group_id}`;
  };

  return (
    <>
      <div
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer"
        onClick={handleClickGroup}
      >
        {/* Group Image */}
        <div className="relative h-48">
          
            <img
              src={group.image ?? GROUP_IMAGE}
              alt={group.group_name}
              className="w-full h-full object-cover"
            />
           
          <div className="absolute inset-0 bg-black/30" />
          {session?.user?.role === "admin" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Group Info */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            {group.group_name}
            {group.privacy === "private" && (
              <RiGitRepositoryPrivateFill className="ml-1 inline text-gray-400" />
            )}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2">{group.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-400">
                {group.number_of_members}
              </span>
              <span className="text-xs text-gray-600">Members</span>
            </div>
            <div className="flex flex-col items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-400">
                {group.number_of_posts}
              </span>
              <span className="text-xs text-gray-600">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-400">
                {new Date(group.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-600">Created</span>
            </div>
          </div>

          {/* Action Button */}
          {!groupSet.has(group.group_id) && (
            <button
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleJoinGroup(group.group_id);
              }}
            >
              Join Group
            </button>
          )}
        </div>
      </div>

      <ModalDeleteGroup
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        group={group}
        onConfirm={handleDelete}
      />
    </>
  );
}
