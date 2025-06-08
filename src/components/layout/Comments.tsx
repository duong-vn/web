"use client";
import { mutate } from "swr";
import { useEffect } from "react";
import { getComments, postCreateComment, deleteComment } from "@/app/services/apiServices";
import useSWR from "swr";
import { useState } from "react";
import { USER_IMAGE } from "@/app/utils/constants";
import { toast } from "react-toastify";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Loading from "./Loading";
import ModalDeleteComment from "./ModalDeleteComment";

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
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    const res = await getComments(post_id);
    const data = await res.json();
    setComments(data.comments);
    setIsLoading(false);
  };

  useEffect(() => {
    if (showComment) {
      fetchComments();
    }
  }, [showComment, post_id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!curUser){
      toast.error("You need to be signed in in order to comment")
      return;
    }
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

  const handleDeleteComment = async (comment_id: number) => {
    if (!curUser) {
      toast.error("You need to be signed in to delete comments");
      return;
    }

    try {
      const res = await deleteComment(comment_id);
      if (res.ok) {
        toast.success("Comment deleted successfully");
        setShowDeleteModal(false);
        setCommentToDelete(null);
        await fetchComments();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const openDeleteModal = (comment_id: number) => {
    setCommentToDelete(comment_id);
    setShowDeleteModal(true);
  };

  console.log(`comments in post:${post_id}`,comments)
  if(isLoading){
    return(<Loading/>)
  }
  return (
    <div className="mt-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <form
          onSubmit={handleSubmitComment}
          className="mb-6 flex flex-col gap-3"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.image ?? USER_IMAGE}
                    alt={comment.username}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-700"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-100">
                        {comment.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    {curUser === comment.user_id && (
                      <button
                        onClick={() => openDeleteModal(comment.comment_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && commentToDelete && (
        <ModalDeleteComment
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          onConfirm={() => handleDeleteComment(commentToDelete)}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
        />
      )}
    </div>
  );
}
