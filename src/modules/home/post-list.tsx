// "use client";

import Link from "next/link";
import Post from "@/components/post";
import Pagination from "@/modules/home/pagination";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PostListProps {
	searchParams: Promise<{ page?: string }>;
}

// async function can directly access db
const PostList = async ({ searchParams }: PostListProps) => {
	// await searchParams at first
	const params = await searchParams;
	const currentPage = parseInt(params?.page || "1");
	const pageSize = 6;

	// directly read data from postgres db (no need API)
	const [posts, totalCount] = await Promise.all([
		prisma.post.findMany({
			skip: (currentPage - 1) * pageSize,
			take: pageSize,
			include: {
				author: {
					select: {
						id: true,
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		}),
		prisma.post.count(),
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	// transform data format to meet frontend post interface
	const transformedPosts = posts.map((post) => ({
		id: post.id.toString(),
		title: post.title,
		content: post.content,
		createdAt: post.createdAt.getTime(),
		author: post.author,
	}));

	return (
		<div className="mt-8">
			{transformedPosts.length === 0 ? (
				<div className="text-white/50 text-center py-8">
					No posts yet
				</div>
			) : (
				transformedPosts.map((post) => (
					<Link key={post.id} href={`/post/${post.id}`}>
						<Post post={post} />
					</Link>
				))
			)}
			{totalPages > 1 && (
				<div className="mt-8">
					<Pagination totalPages={totalPages} />
				</div>
			)}
		</div>
	);
};

export default PostList;
