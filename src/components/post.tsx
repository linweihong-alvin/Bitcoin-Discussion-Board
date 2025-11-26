interface PostProps {
	post?: Post; // post may be provided, but it's not required
}

const Post = ({ post }: PostProps) => {
	// Safe destructuring with defaults (no error when post is undefined)
	// if post?.title is missing/undefined, title will default to "--"
	const { title = "--", content = "-", createdAt = 0 } = post || {};
	return (
		// border-b: bottom border width 1 px
		<div className="w-full border-b border-white/10 py-6">
			<h3 className="text-sm text-white font-bold">{title}</h3>
			<p className="text-sm text-white/50 mt-2">{content}</p>
			<p className="text-sm text-white/50 mt-2">
				{new Date(createdAt).toLocaleString()}
				{/* 2025-07-25 */}
			</p>
		</div>
	);
};

export default Post;
