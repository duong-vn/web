"use client";
import { mutate } from "swr";
import { useEffect } from "react";
import { getComments, postCreateComment } from "@/app/services/apiServices";
import useSWR from "swr";
import { useState } from "react";
import { USER_IMAGE } from "@/app/utils/constants";
import { toast } from "react-toastify";
interface IProps {
  post_id: number;
  curUser: number;
  showComment: boolean;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Comments({ post_id, curUser, showComment }: IProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  // const { data, error, isLoading, isValidating, mutate } = useSWR(
  //   `/api/comments/all?post_id=${post_id}`,
  //   fetcher
  // );
  // console.log("check data", data);
  const fetchComments = async () => {
    const res = await getComments(post_id);
    const data = await res.json();
    setComments(data.comments);
    console.log("comments data", comments);
  };
  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    console.log("Submitting comment:", newComment, post_id, curUser);
    try {
      const res = await postCreateComment(post_id, curUser, newComment);

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Error posting comment");
        return;
      }
      toast.success("Comment posted successfully");
      console.log("Comment posted:", data.comment);
    } catch (error) {
      console.log("Error posting comment:", error);
      toast.error("Error posting comment");
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");

      return; // Prevent empty comments
    }

    setNewComment("");
    await fetchComments();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Comment Form */}
      {showComment && (
      <form
        onSubmit={handleSubmitComment}
        className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg"
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write comment..."
          className="w-full h-20 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={2}
        ></textarea>
        <button
          type="submit"
          className="self-end px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-75 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.comment_id}
            className="flex gap-3 p-2 bg-white rounded-lg shadow-sm"
          >
            <img
              src={comment.image ?? USER_IMAGE}
              alt={comment.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {comment.username}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
