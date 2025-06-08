'use client'
import { fetcher } from "@/app/utils/fetcher";
import useSWR from "swr";
import Post from "./Post";
interface Posts {
    post_id:number;
    content:string;
    user_id: number;
   group_id:number;
    image:string|null,
    privacy:string,
    group_name:string,
    group_image:string,
    username:string,
    user_image:string|null
}
interface IProps{
    group_id:number
    curUser:number
}

export default function PostSection ({group_id,curUser} : IProps){
    const {data,isLoading,error} = useSWR(`/api/posts/group/${group_id}`,fetcher);
    console.log("data trong post scetion",data);
    

    return (
        <>
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
                Cannot load posts
              </div>
              <p className="text-red-400 mt-2">
                Try again later
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.posts?.map((post: any) => (
                <div key={post.post_id} className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Post post={post} curUser={curUser} />
                </div>
              ))}
            </div>
          )}</>
        
    )
}