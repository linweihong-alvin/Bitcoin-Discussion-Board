// app/api/users/route.js
import { NextRequest } from "next/server";
import { withApiHandler } from "@/utils/withApiHandler"; // Wrapper for consistent error handling
import { error, success } from "@/utils/apiResponse"; // Helper functions for response formatting

export const POST = withApiHandler(async (request: NextRequest) => {
	try {
		const body = await request.json();

		const { first_name, last_name, password, username } = body;

		if (!first_name || !last_name || !password || !username) {
			return Response.json(error("All fields are required"), {
				status: 400,
			});
		}

		console.log("📤 Creating user:", { first_name, last_name, username });

		// Make request to Spring Boot
		const response = await fetch("http://localhost:8080/v1/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		// Extract data
		const data = await response.json();

		if (!response.ok) {
			return Response.json(
				error(data.message || "Failed to create user"),
				{
					status: response.status, // Forward Spring Boot's error status
				}
			);
		}

		console.log("✅ User created:", data);

		// Forward Spring Boot's success status (could be 200, 201, etc.)
		return Response.json(success(data), {
			status: response.status, // ✅ Use Spring Boot's original status
		});
	} catch (err) {
		console.error("❌ Error:", err);
		return Response.json(error("Failed to create user"), {
			status: 500,
		});
	}
});

// export const GET = withApiHandler(async (request: NextRequest) => {
// 	const { searchParams } = new URL(request.url);
// 	const id = searchParams.get("id");

// 	try {
// 		// If ID is provided, fetch specific user
// 		if (id) {
// 			console.log("🔍 Fetching user with ID:", id);

// 			const response = await fetch(
// 				`http://localhost:8080/v1/user/${id}`,
// 				{
// 					method: "GET",
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 				}
// 			);

// 			if (!response.ok) {
// 				const errorData = await response.json();
// 				return Response.json(
// 					error(errorData.message || "User not found"),
// 					{
// 						status: response.status,
// 					}
// 				);
// 			}

// 			const data = await response.json();
// 			console.log("✅ User fetched:", data);
// 			return Response.json(success(data));
// 		}

// 		// Otherwise, fetch all users
// 		console.log("🔍 Fetching all users...");

// 		const response = await fetch("http://localhost:8080/v1/user", {
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});

// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}

// 		const data = await response.json();
// 		console.log("✅ Users fetched:", data);

// 		return Response.json(success(data));
// 	} catch (err) {
// 		console.error("❌ Error:", err);
// 		return Response.json(error("Failed to fetch users"), {
// 			status: 500,
// 		});
// 	}
// });
