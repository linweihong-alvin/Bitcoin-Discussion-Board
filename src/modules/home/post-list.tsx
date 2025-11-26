"use client";

import Link from "next/link";
import Post from "@/components/post";
import Pagination from "@/modules/home/pagination";

const mockPosts: Post[] = [
	{
		id: "1",
		title: "Post 1",
		content: "Content 1",
		createdAt: 0,
	},
	// {
	// 	id: "2",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "3",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "4",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "5",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "6",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "7",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
	// {
	// 	id: "8",
	// 	title: "",
	// 	content: "Content 1",
	// 	createdAt: 0,
	// },
];

const PostList = () => {
	return (
		<div className="mt-8">
			{mockPosts.map((post: Post) => (
				<Link key={post.id} href={`/post/${post.id}`}>
					<Post post={post} />
				</Link>
			))}
			<div
				// mt-8: margin top 8*4 = 32 px
				className="mt-8"
			>
				<Pagination totalPages={2} />
			</div>
		</div>
	);
};

export default PostList;
