"use client";
import useSWR from "swr";
import Post from "./Post";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getPosts } from "../services/apiServices";
import { useSession } from "next-auth/react";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostsPage() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);
  const { data: session } = useSession();
  const [curUser, setCurUser] = useState<any>(0);
  useEffect(() => {
    setCurUser(session?.user?.user_id || 0);
    console.log("Session data from posts page:", session);
  }, [session]);

  if (isLoading) {
    return (
      <div className="p-4 ml-64 mt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 ml-64 mt-20">
        <div className="text-red-500 text-center">
          Cannot load posts. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 ml-64 mt-20">
      <div className="flex text-black justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Posts</h1>
          <p className="text-gray-600">Xem bài viết</p>
        </div>
        <div
          className="border-white items-center flex flex-row justify-center cursor-pointer"
          onClick={() => {
            alert("pressed");
          }}
        >
          <span className="flex flex-row bg-blue-300 rounded-lg py-2 px-4 items-center hover:bg-blue-400 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="text-indigo-900">Tạo bài viết</span>
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {data?.map((post: any) => (
          <Post key={post.post_id} post={post} curUser={curUser} />
        ))}
      </div>
    </div>
  );
}
