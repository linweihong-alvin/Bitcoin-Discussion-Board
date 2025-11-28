import { withApiHandler } from "@/utils/withApiHandler";
import { success, error } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = withApiHandler(async (request: NextRequest) => {
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") || "1");
	const pageSize = 5;

	try {
		// Get total count for pagination
		const totalCount = await prisma.post.count();

		// Get posts with author info
		const posts = await prisma.post.findMany({
			skip: (page - 1) * pageSize,
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
		});

		// Transform data to match your Post interface
		const transformedPosts = posts.map((post) => ({
			id: post.id.toString(),
			title: post.title,
			content: post.content,
			createdAt: post.createdAt.getTime(),
			author: post.author,
		}));

		return Response.json(
			success({
				posts: transformedPosts,
				totalPages: Math.ceil(totalCount / pageSize),
				currentPage: page,
			})
		);
	} catch (err: any) {
		console.error("Get posts error:", err);
		return Response.json(error("Failed to fetch posts"), { status: 500 });
	}
});
