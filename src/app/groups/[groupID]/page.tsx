'use client'
import { getGroupByGroupId, isJoinedGroup } from "@/app/services/apiServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Image from 'next/image';
import { GROUP_IMAGE } from "@/app/utils/constants";
import PostSection from "@/components/layout/PostSection";
import { useSession } from "next-auth/react";
import Loading from "@/components/layout/Loading";
import ButtonModalCreatePost from "@/components/layout/ButtonModalCreatePost";
import { fetcher } from "@/app/utils/fetcher";
import useSWR from "swr";
import { leaveGroup } from '@/app/services/apiServices';
import ModalLeaveGroup from '@/components/layout/ModalLeaveGroup';
import { useRouter } from 'next/navigation';

interface GroupData {
  group_id: number;
  group_name: string;
  created_by: number;
  privacy: string;
  image: string | null;
  description: string;
  created_at: string;
  number_of_members: number;
  number_of_posts: number;
}

interface Post {
  post_id: number;
  content: string;
  image: string | null;
  created_at: string;
  user_id: number;
  group_id: number;
  users: {
    username: string;
    image: string | null;
  };
}

export default function DynamicGroup() {
    const params = useParams();
    const groupId = params?.groupID as string;
    const [groupData, setGroupsData] = useState<GroupData | null>(null);
    const {data,isLoading,error} = useSWR(`/api/posts/group/${groupId}`,fetcher);
    const { data: session, status } = useSession();
    const [curUser, setCurUser] = useState<number | null>(null);
    const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
    const [isJoined,setIsJoined] = useState(false);
    const router = useRouter();

    const fetchGroupData = async () => {
        if (!groupId) {
            toast.error('Cannot load group ID');
            return;
        }
        const res = await getGroupByGroupId(groupId);
        const data = await res.json();
   
        setGroupsData(data);
        console.log(data);
    };
    const fetchIsJoined = async ()=>{
            if(session?.user.user_id) {
        const resJoin= await isJoinedGroup(Number(groupId),session.user.user_id)
        const dataJoin = await resJoin.json()
        setIsJoined(Boolean(dataJoin))
       
    }
    
    }

    // const fetchGroupPosts = async () => {
    //     if (!groupId) return;
    //     const res = await fetch(`/api/posts/${groupId}`);
    //     const data = await res.json();
    //     setPosts(data);
    // };

  
    useEffect(() => {
        fetchGroupData();
        fetchIsJoined();
        if (session?.user?.user_id) {
            setCurUser(session.user.user_id);
          
            
        }
        console.log("isjoined",isJoined)
    
        // fetchGroupPosts();
    }, [groupId, session]);

    const handleLeaveGroup = async () => {
        if(!curUser) return;
        try {
             leaveGroup(parseInt(groupId), curUser);
            router.push('/groups'); // Chuyển hướng về trang groups sau khi rời nhóm
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    if (!groupData) return <Loading/>;
    if(status == 'unauthenticated' ){
        window.location.href='/'
    }
    return (
        <div className="max-w-4xl mx-auto p-4 mt-20">
            {/* Group Header */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-6">
                    <div className="relative w-32 h-32">
                    <Image
                            src={groupData.image ??GROUP_IMAGE}
                            alt={groupData.group_name}
                            fill
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-2">{groupData.group_name}</h1>
                        <p className="text-gray-300 mb-4">{groupData.description}</p>
                        <div className="flex gap-4 text-sm text-gray-400">
                            <span>{groupData.number_of_members} members</span>
                            <span>{groupData.number_of_posts} posts</span>
                            <span className="capitalize">{groupData.privacy}</span>
                        </div>
                    </div>
                     <div className="flex gap-4">
                        <ButtonModalCreatePost curUser={session?.user} group_id={Number(groupId)}/>
                        {isJoined && <button
                            onClick={() => setShowLeaveModal(true)}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                            Leave Group
                        </button>}
                    </div>
                </div>
               
            </div>

            <div className="w-full border-b border-gray-600 mb-10"></div>
            {status === 'loading'? (
                (<Loading/>)) 
                : 
                ('')}
                
            
            {curUser && data && <PostSection posts={data.posts} curUser={curUser} isLoading={isLoading} error={error} />}
           
            {/* {status === 'unauthenticated' &&

            <div> you have to be logged in<div/> 
            } */}
            
            
            {/* <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post.post_id} className="bg-gray-900 rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-10 h-10">
                                <Image
                                    src={post.users.image || GROUP_IMAGE}
                                    alt={post.users.username}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{post.users.username}</h3>
                                <p className="text-sm text-gray-400">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-200 mb-4">{post.content}</p>
                        {post.image && (
                            <div className="relative w-full h-64 mb-4">
                                <Image
                                    src={post.image}
                                    alt="Post image"
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div> */}

            <ModalLeaveGroup
                show={showLeaveModal}
                setShow={setShowLeaveModal}
                onConfirm={handleLeaveGroup}
                title="Leave Group"
                message="Are you sure you want to leave this group? You can rejoin later if you change your mind."
            />
        </div>
    );
}