'use client'

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import ModalCreatePost from "./ModalCreatePost";
export default function ButtonModalCreatePost({curUser,group_id}:{curUser:any,group_id:number}){
    const [show,setShow] = useState(false);

    return( 

        <>
         {curUser && <>
         <button
              onClick={() => {
                setShow(true);
              }}
              className="group relative cursor-pointer inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition duration-300 ease-out rounded-full shadow-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 focus:outline-none"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:translate-x-0 ease">
                <PlusIcon className="h-5 w-5" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create new post
              </span>
              <span className="relative invisible">Create new post</span>
            </button>
            <ModalCreatePost show={show} setShow = {setShow} curUser = {curUser} group_id = {group_id} /></>
            }
      </>)
}