"use client";
import useSWR from "swr";
import Post from "../../components/layout/Post";
import { useEffect, useState } from "react";


import ButtonModalCreatePost from '../../components/layout/ButtonModalCreatePost'
import { useSession } from "next-auth/react";
import { fetcher } from "../utils/fetcher";


export default function PostsPage() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);
  const [show,setShow] = useState(false);
  const { data: session,status } = useSession();
  const [curUser, setCurUser] = useState<any>(0);
 

  useEffect(() => {
    setCurUser(session?.user?.user_id );
  }, [session]);
  if (status === 'loading') {
    return <p>Đang kiểm tra phiên đăng nhập...</p>;
  }
  if (status === 'authenticated') {
  return (
    <div className="p-6 ml-64 mt-20 bg-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-2xl shadow-sm p-6 mb-8 border border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Posts
              </h1>
              <p className="text-gray-400 mt-1">Explore Posts</p>
            </div>
            <ButtonModalCreatePost curUser={session?.user} group_id={0}/>
          </div>
        </div> 
      
        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-gray-700"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg font-medium">
              Cannot load posts
            </div>
            <p className="text-gray-400 mt-2">
              Try again later
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {data?.map((post: any) => (
              <div key={post.post_id} className="transform transition-all duration-300 hover:scale-[1.01]">
                <Post post={post} curUser={curUser} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
}
