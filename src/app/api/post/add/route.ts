import { withApiHandler } from "@/utils/withApiHandler"; // @ == src (go to root of the project)
import { success, error } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = withApiHandler(async (request: NextRequest) => {
	const body = await request.json();
	const { title, content, authorId } = body;

	// Validation
	if (!title || !content || !authorId) {
		return Response.json(
			error("Title, content and authorId are required"),
			{
				status: 400,
			}
		);
	}

	try {
		// Create post in PostgreSQL
		// {
		//   id: 1,
		//   title: "My first post",
		//   content: "Hello world",
		//   createdAt: 2025-07-25T10:00:00.000Z,
		//   updatedAt: ...
		//   authorId: 1,
		//   author: {
		//     id: 1,
		//     username: "alvin"
		//   }
		// }
		const post = await prisma.post.create({
			data: {
				title,
				content,
				authorId: parseInt(authorId),
			},
			// Also fetch the related author info, but only id and username
			include: {
				// map to author in prisma Post model
				author: {
					// only take out id and username in users table (avoid taking out password)
					select: {
						id: true,
						username: true,
					},
				},
			},
		});

		// Transform the Prisma result to match the API response interface
		const transformedPost = {
			// Convert numeric id to string (frontend expects string ids)
			id: post.id.toString(),
			title: post.title,
			content: post.content,
			// Convert Date to a timestamp (milliseconds since epoch)
			createdAt: post.createdAt.getTime(),
			author: post.author,
		};

		return Response.json(success(transformedPost), { status: 201 });
	} catch (err: any) {
		console.error("Create post error:", err);
		return Response.json(error("Failed to create post"), { status: 500 });
	}
});
