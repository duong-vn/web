'use client'
import useSWR from 'swr';
import Post from './Post';
import { PlusIcon } from "@heroicons/react/24/outline";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function postsPage(){
    const {data, error} = useSWR('api/posts', fetcher);
    console.log("posts data",data);


    return (
        <div className='p-4 ml-64 mt-20'>
          <div className="flex text-black justify-between">
        <div>
            <h1 className="text-2xl font-bold text-indigo-900">
                Posts
            </h1>
            <p>
                views posts 
            </p>

        </div>
       <div className=" border-white bg- items-center flex flex-row justify-center   "  onClick={()=>{alert('pressed')}}> 
        <span className="flex flex-row bg-blue-300 border-radius rounded-sm py-2 px-2 items-center hover:bg-blue-400 cursor-pointer">
        <PlusIcon className="h-5 w-5 mr-2" />
        <span className="text-indigo-900 "  >
                Create Post
        </span>
            </span>
        </div>
           


        

        </div>
          <Post />
        </div>
    )


}