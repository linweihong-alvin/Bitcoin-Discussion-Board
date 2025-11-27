"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { useState, useEffect } from "react";
import { updatePost } from "@/actions/post-actions";

interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: number;
}

interface EditDialogProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	post: Post;
	userId: number;
	onUpdated: (post: Post) => void;
}

const EditDialog = ({
	isOpen,
	setIsOpen,
	post,
	userId,
	onUpdated,
}: EditDialogProps) => {
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// reset form when opening window
	useEffect(() => {
		if (isOpen) {
			setTitle(post.title);
			setContent(post.content);
		}
	}, [isOpen, post]);

	const handleUpdate = async () => {
		if (!title.trim() || !content.trim()) {
			alert("please fill in title and content");
			return;
		}

		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append("postId", post.id);
			formData.append("title", title);
			formData.append("content", content);
			formData.append("userId", userId.toString());

			const result = await updatePost(formData);

			if (result.success) {
				// update successfully
				onUpdated({
					...post,
					title,
					content,
				});
				setIsOpen(false);
			} else {
				alert(result.error || "update failed");
			}
		} catch (error) {
			console.error("Update failed:", error);
			alert("Update failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			transition
			className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0 z-50"
		>
			<DialogBackdrop className="fixed inset-0 bg-black/70" />
			<DialogPanel className="max-w-lg w-full z-50 space-y-4 bg-[#131313] border border-white/10 p-4 rounded-lg">
				<DialogTitle className="font-bold text-white">
					edit post
				</DialogTitle>

				<div>
					<label className="block text-white text-sm mb-2">
						title
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full h-[40px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40 bg-transparent text-white"
						placeholder="title"
					/>
				</div>

				<div>
					<label className="block text-white text-sm mb-2">
						content
					</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full h-[150px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40 bg-transparent text-white"
						placeholder="content"
					/>
				</div>

				<div className="flex gap-4 text-sm justify-end">
					<button
						className="px-4 py-2 text-white/50 font-bold cursor-pointer hover:text-white"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						cancel
					</button>
					<button
						className={`px-4 py-2 bg-blue-600 text-white font-bold rounded ${isSubmitting ? "opacity-50" : "hover:bg-blue-700 cursor-pointer"}`}
						onClick={handleUpdate}
						disabled={isSubmitting}
					>
						{isSubmitting ? "saving..." : "save"}
					</button>
				</div>
			</DialogPanel>
		</Dialog>
	);
};

export default EditDialog;
