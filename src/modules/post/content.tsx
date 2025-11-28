"use client";

import Post from "@/components/post";
import { useRouter, useParams } from "next/navigation";
import { mockPost } from "@/mocks/posts";

const Content = () => {
	const router = useRouter();
	const { id } = useParams(); // id should meet the "app/post/[id]" path

	// todo: del
	console.log(id);

	return (
		<div>
			<button
				// router.push("/post/1")
				onClick={() => router.back()}
				className="text-sm text-white font-bold"
			>
				{"← Back"}
			</button>
			<Post post={mockPost} />
		</div>
	);
};

export default Content;
