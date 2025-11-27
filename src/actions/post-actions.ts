"use server"; // tells Next.js that this file runs on the server

import { revalidatePath } from "next/cache"; // Next.js API for revalidating cached pages
import { prisma } from "@/lib/prisma";

// This function runs on the server and creates a new post
export async function createPost(formData: FormData) {
	// Extract data from the form
	const title = formData.get("title") as string;
	const content = formData.get("content") as string;
	const authorId = formData.get("authorId") as string;

	// Validate required fields
	if (!title || !content || !authorId) {
		return { success: false, error: "Missing required fields" };
	}

	try {
		// Write directly to the PostgreSQL database using Prisma
		await prisma.post.create({
			data: {
				title,
				content,
				authorId: parseInt(authorId),
			},
		});

		// tell Next.js to revalidate the "/" route (homepage) so it refetches fresh data
		// this makes the page show the new post without using window.reload()
		revalidatePath("/");

		return { success: true };
	} catch (error) {
		console.error("Error creating post:", error);
		return { success: false, error: "Failed to create post" };
	}
}
