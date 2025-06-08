"use client";
import useSWR from "swr";
import Post from "../../components/layout/Post";
import { useEffect, useState } from "react";
import Loading from "@/components/layout/Loading";
import ButtonModalCreatePost from '../../components/layout/ButtonModalCreatePost'
import { useSession } from "next-auth/react";
import { fetcher } from "../utils/fetcher";
import PostSection from "@/components/layout/PostSection";

export default function PostsPage() {
  const [show, setShow] = useState(false);
  const { data: session, status } = useSession();
  const [curUser, setCurUser] = useState<number>(0);

  useEffect(() => {
    setCurUser(session?.user?.user_id ?? 0);
  }, [session]);

  const { data, error, isLoading } = useSWR(
    status !== 'loading' ? (curUser ? `/api/posts?user_id=${curUser}` : '/api/posts/guest') : null,
    fetcher
  );
console.log('data trong post',data);
  if (status === 'loading') {
    return <p>Đang kiểm tra phiên đăng nhập...</p>;
  }
if(isLoading){
  return(<Loading/>)
}
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
            {curUser?  <ButtonModalCreatePost curUser={session?.user} group_id={0}/> : ''}
            
          </div>
        </div> 

        {data && <PostSection isLoading={isLoading} error={error} posts={data} curUser={curUser}/>}
      </div>
    </div>
  );
}
