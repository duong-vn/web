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
    const [newComment, setNewComment] = useState('');

    useEffect(()=>{
        const fetchComments = async () => {
        const res =  await getComments(post_id);
        const data = await res.json();
            setComments(data.comments);
            console.log("comments data",comments);
        }
        fetchComments();
    },[]);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement comment submission
        console.log('Submitting comment:', newComment);
        setNewComment('');
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full h-20 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                />
                <button
                    type="submit"
                    className="self-end px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Đăng bình luận
                </button>
            </form>

            {/* Comments List */}
            <div className="flex flex-col gap-3 max-h-50 overflow-y-auto">
                {comments.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <img 
                            src={comment.image ?? USER_IMAGE} 
                            alt={comment.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{comment.username}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}