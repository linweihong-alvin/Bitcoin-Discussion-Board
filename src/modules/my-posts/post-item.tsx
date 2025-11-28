"use client";

import { useState } from "react";
import { deletePost, updatePost } from "@/actions/post-actions";
import EditDialog from "./edit-dialog";

interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: number;
}

interface PostItemProps {
	post: Post;
	userId: number;
	onDeleted: (postId: string) => void;
	onUpdated: (post: Post) => void;
}

const PostItem = ({ post, userId, onDeleted, onUpdated }: PostItemProps) => {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!confirm("are you sure to delete?")) {
			return;
		}

		setIsDeleting(true);

		try {
			const formData = new FormData();
			formData.append("postId", post.id);
			formData.append("userId", userId.toString());

			const result = await deletePost(formData);

			if (result.success) {
				onDeleted(post.id);
			} else {
				alert(result.error || "delete failed");
			}
		} catch (error) {
			console.error("Delete failed:", error);
			alert("delete failed");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="bg-[#131313] border border-white/10 rounded-lg p-6">
				<h3 className="text-xl font-bold text-white mb-2">
					{post.title}
				</h3>
				<p className="text-white/70 mb-4 line-clamp-3">
					{post.content}
				</p>

				<div className="flex justify-between items-center">
					<span className="text-sm text-white/50">
						{new Date(post.createdAt).toLocaleString()}
					</span>

					<div className="flex gap-2">
						<button
							onClick={() => setIsEditOpen(true)}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
						>
							edit
						</button>
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
						>
							{isDeleting ? "deleting..." : "delete"}
						</button>
					</div>
				</div>
			</div>

			<EditDialog
				isOpen={isEditOpen}
				setIsOpen={setIsEditOpen}
				post={post}
				userId={userId}
				onUpdated={onUpdated}
			/>
		</>
	);
};

export default PostItem;
