"use client";
import { mutate } from "swr";
import { useEffect } from "react";
import { getComments, postCreateComment } from "@/app/services/apiServices";
import useSWR from "swr";
import { useState } from "react";
import { USER_IMAGE } from "@/app/utils/constants";
import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface IProps {
  post_id: number;
  curUser: number;
  showComment: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Comments({ post_id, curUser, showComment }: IProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    const res = await getComments(post_id);
    const data = await res.json();
    setComments(data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [newComment]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await postCreateComment(post_id, curUser, newComment);
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Error posting comment");
        return;
      }

      toast.success("Comment posted successfully");
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Error posting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Comment Form */}
      {showComment && (
        <form
          onSubmit={handleSubmitComment}
          className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full h-24 p-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                "Posting..."
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div
            key={comment.comment_id}
            className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <img
              src={comment.image ?? USER_IMAGE}
              alt={comment.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {comment.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
