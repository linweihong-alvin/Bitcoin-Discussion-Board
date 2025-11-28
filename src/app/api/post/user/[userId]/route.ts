import { success, error } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		// await params to get params
		const { userId } = await params;
		const userIdNum = parseInt(userId);

		if (isNaN(userIdNum)) {
			return Response.json(error("Invalid user ID"), { status: 400 });
		}

		// Get all posts by this user
		const posts = await prisma.post.findMany({
			where: {
				authorId: userIdNum,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Transform data
		const transformedPosts = posts.map((post) => ({
			id: post.id.toString(),
			title: post.title,
			content: post.content,
			createdAt: post.createdAt.getTime(),
		}));

		return Response.json(success(transformedPosts));
	} catch (err: any) {
		console.error("Get user posts error:", err);
		return Response.json(error("Failed to fetch posts"), { status: 500 });
	}
}
