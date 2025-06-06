"use client";
import useSWR from "swr";
import Post from "../../components/layout/Post";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostsPage() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);
  const { data: session } = useSession();
  const [curUser, setCurUser] = useState<any>(0);

  useEffect(() => {
    setCurUser(session?.user?.user_id || 0);
  }, [session]);

  return (
    <div className="p-6 ml-64 mt-20 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-indigo-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Posts
              </h1>
              <p className="text-gray-600 mt-1">Khám phá những bài viết mới nhất</p>
            </div>
            <button
              onClick={() => {
                alert("pressed");
              }}
              className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition duration-300 ease-out rounded-full shadow-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 focus:outline-none"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:translate-x-0 ease">
                <PlusIcon className="h-5 w-5" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                <PlusIcon className="h-5 w-5 mr-2" />
                Tạo bài viết
              </span>
              <span className="relative invisible">Tạo bài viết</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-indigo-200"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-lg font-medium">
              Không thể tải bài viết
            </div>
            <p className="text-red-400 mt-2">
              Vui lòng thử lại sau
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
