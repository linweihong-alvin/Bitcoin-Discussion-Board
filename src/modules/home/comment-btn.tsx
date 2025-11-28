"use client";

import { useState } from "react";
import CommentEditor from "./comment-editor";

const CommentBtn = () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				// h-[32px]: fixed height of 32px
				// flex: Makes the button a flex container so you can easily center its content
				// justify-center:  Horizontally centers the content inside the button
				// items-center: Vertically centers the content inside the button
				// rounded-lg: medium-large rounded corners.
				// p-4: add padding on all sides (4 = 1rem ≈ 16px).
				// cursor-pointer: Shows the pointer (hand) cursor when hovering, indicating it’s clickable.
				className="w-full h-[32px] flex justify-center items-center rounded-lg bg-white p-4 text-sm text-black font-bold cursor-pointer"
			>
				What's on your mind?
			</button>
			<CommentEditor isOpen={isOpen} setIsOpen={setIsOpen} />
		</>
	);
};

export default CommentBtn;
