"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react"; // headlessui UI: compatible with Tailwind
import { useState } from "react";

interface CommentEditorProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const CommentEditor = ({ isOpen, setIsOpen }: CommentEditorProps) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};
	const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
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
				<input
					placeholder="Title"
					type="text"
					// rounded-md: medium rounded corner
					// focus:outline-none: remove outline when click on (focus on) input area
					// focus:border-white/40: add light border
					className="w-full h-[40px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40"
					value={title}
					onChange={onTitleChange}
				/>
				<textarea
					placeholder="Comment"
					className="w-full h-[100px] border text-sm border-white/10 rounded-md p-2 focus:border-white/40"
					value={content}
					onChange={onContentChange}
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
					>
						Cancel
					</button>
					<button
						className="text-white font-bold cursor-pointer"
						onClick={() => setIsOpen(false)}
					>
						Post
					</button>
				</div>
			</DialogPanel>
		</Dialog>
	);
};

export default CommentEditor;
