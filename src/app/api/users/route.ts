// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Create Basic Authentication header from username and password
 * @param username - User's email/username
 * @param password - User's password
 * @returns Base64 encoded Basic Auth header
 */
function getAuthHeader(username: string, password: string): string {
	const credentials = `${username}:${password}`;
	const base64Credentials = Buffer.from(credentials).toString("base64");
	return `Basic ${base64Credentials}`;
}

/**
 * GET handler - Fetches user details by ID using Basic Auth credentials
 * Expects userId, username, and password as query parameters
 */
export async function GET(request: NextRequest) {
	try {
		// Extract parameters from query string
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");
		const username = searchParams.get("username");
		const password = searchParams.get("password");

		// Validate that all required parameters are provided
		if (!userId || !username || !password) {
			console.error("❌ Missing required parameters");
			return NextResponse.json(
				{
					success: false,
					message: "userId, username, and password are required",
				},
				{ status: 400 }
			);
		}

		console.log("🔍 Fetching user with ID:", userId);
		console.log("📍 Using credentials:", username);

		// Call Spring Boot backend with user ID in path and Basic Auth
		const response = await fetch(
			`http://demo.alvincloud.me/v1/user/${userId}`,
			// `http://localhost:8080/v1/user/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: getAuthHeader(username, password),
				},
			}
		);

		console.log("📊 Response status:", response.status);

		// Handle non-OK responses
		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ Error response:", errorText);
			return NextResponse.json(
				{ success: false, message: "Failed to fetch user" },
				{ status: response.status }
			);
		}

		// Parse and return successful response
		const data = await response.json();
		console.log("✅ User fetched:", data);

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("❌ Error:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch user" },
			{ status: 500 }
		);
	}
}

/**
 * POST handler - Creates a new user
 * No authentication required for user registration
 */
export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body = await request.json();

		// Destructure and validate required fields
		const { first_name, last_name, password, username } = body;

		if (!first_name || !last_name || !password || !username) {
			console.error("❌ Missing required fields");
			return NextResponse.json(
				{ success: false, message: "All fields are required" },
				{ status: 400 }
			);
		}

		console.log("📤 Creating user:", { first_name, last_name, username });

		// Call Spring Boot backend to create user
		const response = await fetch("http://demo.alvincloud.me/v1/user", {
			// const response = await fetch("http://localhost:8080/v1/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		console.log("📊 Response status:", response.status);

		// Parse response data
		const data = await response.json();

		// Handle non-OK responses
		if (!response.ok) {
			console.error("❌ Creation failed:", data);
			return NextResponse.json(
				{
					success: false,
					message: data.message || "Failed to create user",
				},
				{ status: response.status }
			);
		}

		console.log("✅ User created:", data);

		// Return successful response with original status code
		return NextResponse.json(
			{ success: true, data },
			{ status: response.status }
		);
	} catch (error) {
		console.error("❌ Error:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to create user" },
			{ status: 500 }
		);
	}
}
