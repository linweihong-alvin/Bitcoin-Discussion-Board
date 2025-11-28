import CommentBtn from "@/modules/home/comment-btn";
import Pagination from "@/modules/home/pagination";
import Image from "next/image";
import PostList from "./post-list";
import MyPostsLink from "./my-posts-link";

interface ContentProps {
	searchParams: Promise<{ page?: string }>;
}

const Content = async ({ searchParams }: ContentProps) => {
	return (
		<>
			<div className="flex justify-end mb-4">
				<MyPostsLink />
			</div>
			<Image
				// can be accessed by localhost:3000/images/xxx.jpg
				src="/images/bitcoin-banner.jpeg"
				// 1. w-full: fill width of its parent container (so if screen is 500px, image become 500 px width)
				// 2. rounded-lg: medium-large rounded corners
				// 3. border: set 1px border (border-width)
				// 4. border-white/10: sets the border color = white with 10% opacity
				className="w-full rounded-lg border border-white/10"
				// original size of image, help next.js recognize the ration of image
				width={1584}
				height={396}
				alt="bitcoin-banner"
			/>
			<h1
				// 1. text-2xl: set the font size to Tailwind’s 2xl size (bigger than normal body text, used for titles)
				// 2. mt-2: margin-top with spacing 2 (0.5rem / 8px)
				className="text-2xl font-bold mt-2"
			>
				@bitcoin
			</h1>
			<p
				// 1. text-white/50: 50% opacity
				className="text-sm text-white/50 mt-2"
			>
				Bitcoin is a decentralized digital currency that enables
				instant, peer-to-peer transactions without intermediaries. It is
				based on blockchain technology, which is a distributed ledger
				that records transactions in a secure and transparent manner.
			</p>
			<div className="w-full mt-8">
				<CommentBtn />
			</div>

			{/* pass searchParams to PostList */}
			<PostList searchParams={searchParams} />
		</>
	);
};

export default Content;
