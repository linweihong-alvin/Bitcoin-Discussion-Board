"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MyPostsLink = () => {
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	if (!user) {
		return null;
	}

	return (
		<Link
			href="/my-posts"
			className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 text-sm"
		>
			My posts
		</Link>
	);
};

export default MyPostsLink;
