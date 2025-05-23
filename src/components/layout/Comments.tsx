'use client'
import { useEffect } from "react" ;
import { getComments } from "@/app/services/apiServices";
import {useState } from "react";
import { USER_IMAGE } from "@/app/utils/constants";
interface IProps {
    post_id: number;
}


export default function Comments  ({post_id}: IProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    useEffect(()=>{
        const fetchComments = async () => {
        const res =  await getComments(1);
        const data = await res.json();
            setComments(data.comments);
            console.log("comments data",comments);
        }
        fetchComments();
    },[]);


    return (
        <div className="flex flex-col gap-2 overflow-y-auto h-96">
            { comments.map((comment) => (
                <div key={comment.comment_id} className="flex flex-row gap-2 p-2 border-b border-gray-300">
                    <img src={comment.image??USER_IMAGE}  className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                        <span className="font-bold">{comment.username}</span>
                        <span>{comment.content}</span>
                    </div>
                </div>
            ))

            }
        </div>
    )
}