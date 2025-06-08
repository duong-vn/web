"use client";

import { useEffect, useState } from "react";

import { PlusIcon } from "@heroicons/react/24/outline";
import GroupCard from "./GroupCard";
import useSWR from "swr";
import { mutate } from "swr";
import { useSession } from "next-auth/react";
import ModalCreateGroup from "./ModalCreateGroup";
import { getGroups, postJoinGroup,getGroupByUserId } from "../services/apiServices";
import { toast } from "react-toastify";


const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [groups,setGroups] = useState([]);
 const [joinedGroup, setJoinedGroup] = useState<[]>([]);
 const [groupSet, setGroupSet] = useState<Set<number>>(new Set());
  const { data: session } = useSession();
    const fetchGroups = async ()=>{
     const res = await getGroups();
     const data = await res.json();
     setGroups(data);


    } 
    useEffect(() => {
      const getJoinedGroup = async () => {
        try {
          const response = await getGroupByUserId(session?.user?.user_id || 0);
          const data = await response.json();
          setJoinedGroup(data);
          console.log('get joined group',data)
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


    

  const handleJoinGroup = async (groupId: number) => {
    if (!session?.user.user_id) {
      toast.error("Please login to join group");
      return;
    }
    try {
      const user_id = session.user.user_id;
      const res = await postJoinGroup(user_id, groupId);
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        // Fetch lại danh sách groups sau khi tham gia thành công
        await fetchGroups();
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    }
  };
  useEffect(()=>{
    fetchGroups();
  },[])
  return (
    <div className="p-4 ml-64 h-[calc(100vh-64px)] mt-16">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 ">Groups</h1>
          <p className="text-gray-400">Join and manage your groups</p>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Group
            </button>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group: Group) => (
                  <GroupCard
                    key={group.group_id}
                    group={group}
                    handleJoinGroup={handleJoinGroup}
                    joinedGroup={joinedGroup}
                    groupSet={groupSet}
                  />
                ))}
              </div>
            
          </div>
        </div>
      </div>

      <ModalCreateGroup
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        created_by={session?.user.user_id || null}
      />
    </div>
  );
}
