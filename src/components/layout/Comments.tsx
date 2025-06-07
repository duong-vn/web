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
    <div className="mt-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <form
          onSubmit={handleSubmitComment}
          className="mb-4 flex flex-col gap-3"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-gray-900 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.image ? (
                    <img
                      src={comment.image}
                      alt={comment.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-300 text-sm font-medium">
                        {comment.username.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-100">
                        {comment.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
