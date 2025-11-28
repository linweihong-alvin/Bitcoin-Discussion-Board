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
		revalidatePath("/my-posts");

		return { success: true };
	} catch (error) {
		console.error("Create post error:", error);
		return { success: false, error: "Failed to create post" };
	}
}

// edit post
export async function updatePost(formData: FormData) {
	const postId = formData.get("postId") as string;
	const title = formData.get("title") as string;
	const content = formData.get("content") as string;
	const userId = formData.get("userId") as string;

	if (!postId || !title || !content || !userId) {
		return { success: false, error: "Missing required fields" };
	}

	try {
		// check author
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) },
		});

		if (!post || post.authorId !== parseInt(userId)) {
			return { success: false, error: "Unauthorized" };
		}

		// update post in postgre
		await prisma.post.update({
			where: { id: parseInt(postId) },
			data: {
				title,
				content,
				updatedAt: new Date(),
			},
		});

		revalidatePath("/");
		revalidatePath("/my-posts");
		revalidatePath(`/post/${postId}`);

		return { success: true };
	} catch (error) {
		console.error("Update post error:", error);
		return { success: false, error: "Failed to update post" };
	}
}

// delete post
export async function deletePost(formData: FormData) {
	const postId = formData.get("postId") as string;
	const userId = formData.get("userId") as string;

	if (!postId || !userId) {
		return { success: false, error: "Missing required fields" };
	}

	try {
		// check author
		const post = await prisma.post.findUnique({
			where: { id: parseInt(postId) },
		});

		if (!post || post.authorId !== parseInt(userId)) {
			return { success: false, error: "Unauthorized" };
		}

		// delete post in db
		await prisma.post.delete({
			where: { id: parseInt(postId) },
		});

		revalidatePath("/");
		revalidatePath("/my-posts");

		return { success: true };
	} catch (error) {
		console.error("Delete post error:", error);
		return { success: false, error: "Failed to delete post" };
	}
}
