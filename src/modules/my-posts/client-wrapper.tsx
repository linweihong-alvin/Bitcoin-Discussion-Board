"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostItem from "./post-item";

interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: number;
}

const ClientWrapper = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// check login
		const userData = localStorage.getItem("user");
		if (!userData) {
			router.push("/test-user");
			return;
		}

		const parsedUser = JSON.parse(userData);
		setUser(parsedUser);

		// get user's posts
		fetchMyPosts(parsedUser.id);
	}, [router]);

	const fetchMyPosts = async (userId: number) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/post/user/${userId}`);
			const result = await response.json();

			if (result.status === 1) {
				setPosts(result.data);
			}
		} catch (error) {
			console.error("Failed to fetch posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePostDeleted = (postId: string) => {
		setPosts(posts.filter((p) => p.id !== postId));
	};

	const handlePostUpdated = (updatedPost: Post) => {
		setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
	};

	if (loading) {
		return <div className="text-white/50">Loading...</div>;
	}

	if (!user) {
		return null;
	}

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-white">my post</h1>
				<button
					onClick={() => router.push("/")}
					className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
				>
					back to homepage
				</button>
			</div>

			{posts.length === 0 ? (
				<div className="text-white/50 text-center py-8">
					no post yet
				</div>
			) : (
				<div className="space-y-4">
					{posts.map((post) => (
						<PostItem
							key={post.id}
							post={post}
							userId={user.id}
							onDeleted={handlePostDeleted}
							onUpdated={handlePostUpdated}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ClientWrapper;
