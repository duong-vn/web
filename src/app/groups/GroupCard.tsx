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

interface GroupCardProps {
  group: Group;
  handleJoinGroup: (groupId: string) => void;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAdmin = group.created_by === session?.user?.user_id;
  const [joinedGroup, setJoinedGroup] = useState<[]>([]);
  const [groupSet, setGroupSet] = useState<Set<number>>(new Set());
  const handleDelete = async () => {
    try {
      const res = await deleteGroup(group.group_id);
      const data = await res.json();

      if (res.ok) {
        mutate("api/groups");
        toast.success("Group deleted successfully");
        setShowDeleteModal(false);
      } else {
        toast.error(data.message || "Error deleting group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Error deleting group");
    }
  };
  useEffect(() => {
    const getJoinedGroup = async () => {
      const res = await getGroupById(session?.user?.user_id || 0);
      // const res = await getGroupById(3);

      const data = await res.json();
      console.log("joined group data>>", data);
      setJoinedGroup(data);
      console.log("joined group>> be4", joinedGroup);
    };

    getJoinedGroup();
  }, []);

  useEffect(() => {
    console.log("joined group>> now", joinedGroup);

    if (joinedGroup.length > 0) {
      // Cập nhật state groupSet
      setGroupSet(new Set(joinedGroup.map((g: any) => g.group_id)));
    }

    console.log("joined group set>>", groupSet);
  }, [joinedGroup]);

  const handleClickGroup = () => {
    console.log("Group clicked:", group.group_id);
    // Navigate to group details page or perform any other action
  };
  const handleJoinGroup = () => {
    console.log(
      `Joining group with ID: ${group.group_id} by user ${session?.user?.user_id}`
    );
  };

  return (
    <>
      <div
        className="bg-white border rounded-lg overflow-hidden hover:border-emerald-500 transition-colors"
        onClick={handleClickGroup}
      >
        {/* Group Image */}
        <div className="h-48 bg-emerald-100 relative">
          {group.image ? (
            <img
              src={group.image}
              alt={group.group_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserGroupIcon className="h-16 w-16 text-emerald-400" />
            </div>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Group Info */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-emerald-900 mb-2">
            {group.group_name}
            {group.privacy === "private" ? (
              <RiGitRepositoryPrivateFill className="ml-1 inline" />
            ) : (
              <MdOutlinePublic className="ml-1 inline" />
            )}
          </h3>
          <p className="text-emerald-600 mb-4 line-clamp-2 ='inline'">
            {group.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-5 w-5 text-emerald-500 mb-1" />
              <span className="text-sm font-medium text-emerald-900">
                {group.number_of_members}
              </span>
              <span className="text-xs text-emerald-600">Members</span>
            </div>
            <div className="flex flex-col items-center">
              <DocumentTextIcon className="h-5 w-5 text-emerald-500 mb-1" />
              <span className="text-sm font-medium text-emerald-900">
                {group.number_of_posts}
              </span>
              <span className="text-xs text-emerald-600">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <CalendarIcon className="h-5 w-5 text-emerald-500 mb-1" />
              <span className="text-sm font-medium text-emerald-900">
                {new Date(group.created_at).toLocaleDateString()}
              </span>
              <span className="text-xs text-emerald-600">Created</span>
            </div>
          </div>

          {/* Action Button */}
          {!groupSet.has(group.group_id) && (
            <button
              className="w-full py-2 px-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              onClick={handleJoinGroup}
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
};

export default GroupCard;
