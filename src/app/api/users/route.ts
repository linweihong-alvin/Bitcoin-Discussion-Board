// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		console.log("🔍 Fetching all users...");

		// Direct call to Spring Boot backend
		const response = await fetch("http://localhost:8080/v1/user", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			return NextResponse.json(
				{ success: false, message: "Failed to fetch users" },
				{ status: response.status }
			);
		}

		const data = await response.json();
		console.log("✅ Users fetched:", data);

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("❌ Error:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { first_name, last_name, password, username } = body;

		if (!first_name || !last_name || !password || !username) {
			return NextResponse.json(
				{ success: false, message: "All fields are required" },
				{ status: 400 }
			);
		}

		console.log("📤 Creating user:", { first_name, last_name, username });

		// Direct call to Spring Boot backend
		const response = await fetch("http://localhost:8080/v1/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					success: false,
					message: data.message || "Failed to create user",
				},
				{ status: response.status }
			);
		}

		console.log("✅ User created:", data);

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
