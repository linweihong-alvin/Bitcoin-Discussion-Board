"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react"; // headlessui UI: compatible with Tailwind
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createPost } from "@/actions/post-actions"; // import server action

interface CommentEditorProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const CommentEditor = ({ isOpen, setIsOpen }: CommentEditorProps) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [user, setUser] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		// Get user from localStorage
		// todo: user login
		localStorage.setItem(
			"user",
			JSON.stringify({
				id: 1,
				username: "alvin",
				email: "alvin@example.com",
			})
		);
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []); // only execute one time after rendering

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
	};

	const handlePost = async () => {
		if (!user) {
			alert("Please login first");
			return;
		}

		if (!title.trim() || !content.trim()) {
			alert("Please fill in both title and content");
			return;
		}

		setIsSubmitting(true);

		// call post add api
		try {
			const response = await fetch("/api/post/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					content,
					authorId: user.id,
				}),
			});

			const result = await response.json();

			if (result.status === 1) {
				// Success
				setTitle("");
				setContent("");
				setIsOpen(false);

				// todo: should use state to render new data
				// Refresh the page to show new post
				// window.location.reload();

				// Show success toast
				toast.success("Post created successfully!");
			} else {
				alert(result.message || "Failed to create post");
			}
		} catch (error) {
			console.error("Failed to create post:", error);
			alert("Failed to create post");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={() => {}}
			// slowly open/close
			transition
			// 1. fixed: stays in fixed place even when scrolling.
			// 2. inset-0: top: 0; right: 0; bottom: 0; left: 0; (makes the element cover the entire screen.)
			//    w-screen: width: 100vw; (full viewport width).
			//    inset-0 + w-screen: fully overlays the page
			// 3. flex: Makes this a flex container
			//    items-center: Vertically centers the children (cross axis).
			//    justify-center: Horizontally centers the children (main axis).
			// 4. transition: animate changes smoothly
			//    duration-300: take 0.3s
			//    ease-out: slow down animation at the end
			//    data-closed:opacity-0 (when having data-closed class, set completely invisible (but still takes up space and can still be in the layout))
			className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-closed:opacity-0"
		>
			<DialogBackdrop
				// DialogBackdrop: the dark overlay behind the dialog
				className="fixed inset-0 bg-black/70"
			/>
			<DialogPanel
				// DialogPanel: actual modal box – the content container in the center.
				// 	•	max-w-lg → limit the dialog’s maximum width (around 32rem ≈ 512px)
				//  •	z-50 → z: layer = put it above the overlay backdrop
				//           Higher z-index → drawn above lower z-index.
				//           50: put this dialog panel above almost everything else on the page.
				//  •	border, rounded-lg, p-4 → card-style panel
				//                 border: set 1px border-width
				//                 rounded-lg: medium-large rounded corners.
				//  •	space-y-4 → vertical spacing between children
				//                (so the title, input, textarea, buttons don’t stick together; there’s ~16px space between each row).
				className="max-w-lg z-50 space-y-4 bg-[#131313] border border-white/10 p-4 rounded-lg"
			>
				<DialogTitle className="font-bold text-white">
					What's on your mind?
				</DialogTitle>
				{!user && (
					<div className="text-yellow-500 text-sm">
						Please login to create a post
					</div>
				)}
				<input
					placeholder="Title"
					type="text"
					// rounded-md: medium rounded corner
					// focus:outline-none: remove outline when click on (focus on) input area
					// focus:border-white/40: add light border
					className="w-full h-[40px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40"
					value={title}
					onChange={onTitleChange}
					disabled={!user}
				/>
				<textarea
					placeholder="Comment"
					className="w-full h-[100px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40"
					value={content}
					onChange={onContentChange}
					disabled={!user}
				/>
				<div
					// 1. flex: Makes this <div> a flex container.
					// 2. gap-4: Adds space between the flex items. (4 = 1rem ≈ 16px)
					// 3. text-sm: Sets the base font size of all element inside this div to small.
					// 4. justify-end: Aligns the flex items to the right of the container (horizontal alignment).
					//                 So the buttons appear on the right side of the row.
					className="flex gap-4 text-sm justify-end"
				>
					<button
						className="text-white/50 font-bold cursor-pointer"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						className={`text-white font-bold ${isSubmitting || !user ? "opacity-50" : "cursor-pointer"}`}
						onClick={handlePost}
						disabled={isSubmitting || !user}
					>
						{isSubmitting ? "Posting..." : "Post"}
					</button>
				</div>
			</DialogPanel>
		</Dialog>
	);
};

export default CommentEditor;
