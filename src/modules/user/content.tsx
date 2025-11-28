// content.tsx
"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

/**
 * Interface for User object structure from backend
 */
interface User {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	email_verified: boolean;
	account_created: string;
	account_updated: string;
}

/**
 * Interface for form data structure
 */
interface FormData {
	first_name: string;
	last_name: string;
	password: string;
	username: string;
}

/**
 * Interface for API response wrapper
 */
interface ApiResponse<T> {
	success?: boolean;
	data?: T;
	message?: string;
}

/**
 * Validation schema using Yup
 * Defines validation rules for each form field
 */
const validationSchema = Yup.object({
	first_name: Yup.string()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name must be less than 50 characters")
		.required("First name is required"),
	last_name: Yup.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name must be less than 50 characters")
		.required("Last name is required"),
	username: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		)
		.required("Password is required"),
});

/**
 * TestUserPage Component
 * Provides UI for managing users - viewing list and creating new users
 * Communicates with Next.js API routes which proxy to Spring Boot backend
 */
export default function TestUserPage() {
	// State for storing the list of users fetched from backend
	const [users, setUsers] = useState<User[]>([]);

	// State for tracking loading status during API calls
	const [loading, setLoading] = useState<boolean>(false);

	// Initial values for the form
	const initialValues: FormData = {
		first_name: "",
		last_name: "",
		password: "",
		username: "",
	};

	/**
	 * useEffect hook - Runs once when component mounts
	 * No initial fetch since we need credentials
	 */
	useEffect(() => {
		// Don't fetch on mount - we need user credentials and ID
	}, []);

	/**
	 * Fetches user details by ID using their credentials (Basic Auth)
	 * @param userId - User's ID from database
	 * @param username - User's email/username
	 * @param password - User's password
	 */
	async function fetchUserById(
		userId: number,
		username: string,
		password: string
	): Promise<void> {
		try {
			setLoading(true);
			console.log("🔍 Fetching user with ID:", userId);

			// Pass userId and credentials as query parameters to Next.js API route
			const response = await fetch(
				`/api/users?userId=${userId}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
			);
			const result: ApiResponse<User> = await response.json();

			console.log("📦 API Response:", result);

			// Check if the API returned an error
			if (result.success === false) {
				console.error("❌ Error:", result.message);
				alert(`Error: ${result.message}`);
				return;
			}

			// Extract user data from response
			const data = result.data;
			console.log("✅ User data:", data);

			// Add or update user in the list
			if (data) {
				setUsers((prevUsers) => {
					// Check if user already exists in list
					const exists = prevUsers.find((u) => u.id === data.id);
					if (exists) {
						// Update existing user
						return prevUsers.map((u) =>
							u.id === data.id ? data : u
						);
					}
					// Add new user to list
					return [...prevUsers, data];
				});
			}
		} catch (error) {
			console.error("❌ Error fetching user:", error);
			alert("Failed to fetch user details");
		} finally {
			setLoading(false);
		}
	}

	/**
	 * Handles form submission to create a new user
	 * Called by Formik when form is submitted and validation passes
	 * @param values - Form values from Formik
	 * @param formikHelpers - Formik helper functions
	 */
	async function handleSubmit(
		values: FormData,
		{ setSubmitting, resetForm }: FormikHelpers<FormData>
	): Promise<void> {
		try {
			console.log("📤 Creating new user:", values);

			// Step 1: Create the user via POST request
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const result: ApiResponse<User> = await response.json();
			console.log("📦 API Response:", result);

			// Check if creation failed
			if (result.success === false) {
				console.error("❌ Error:", result.message);
				alert(`Error: ${result.message}`);
				return;
			}

			const newUser = result.data || (result as User);
			console.log("✅ User created successfully:", newUser);
			console.log("👤 User ID:", newUser.id);

			// Step 2: Fetch the user details using their ID and credentials
			await fetchUserById(newUser.id, values.username, values.password);

			// Step 3: Reset form and show success message
			resetForm();
			alert("User created successfully!");
		} catch (error) {
			console.error("❌ Error creating user:", error);
			alert("Failed to create user");
		} finally {
			// Re-enable the submit button
			setSubmitting(false);
		}
	}

	return (
		<div className="space-y-8">
			{/* Page Title */}
			<h1 className="text-3xl font-bold text-gray-900">
				User Management
			</h1>

			{/* ============ CREATE USER FORM SECTION ============ */}
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-6">
					Create New User
				</h2>

				{/* Formik wrapper handles form state and validation */}
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting, errors, touched }) => (
						<Form className="space-y-4">
							{/* First Name Input */}
							<div>
								<label
									htmlFor="first_name"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									First Name:
								</label>
								<Field
									type="text"
									id="first_name"
									name="first_name"
									placeholder="Enter first name"
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
										errors.first_name && touched.first_name
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								{/* Display validation error message */}
								<ErrorMessage name="first_name">
									{(msg) => (
										<div className="text-red-600 text-sm mt-1">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							{/* Last Name Input */}
							<div>
								<label
									htmlFor="last_name"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Last Name:
								</label>
								<Field
									type="text"
									id="last_name"
									name="last_name"
									placeholder="Enter last name"
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
										errors.last_name && touched.last_name
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								<ErrorMessage name="last_name">
									{(msg) => (
										<div className="text-red-600 text-sm mt-1">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							{/* Email/Username Input */}
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Email/Username:
								</label>
								<Field
									type="email"
									id="username"
									name="username"
									placeholder="Enter email address"
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
										errors.username && touched.username
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								<ErrorMessage name="username">
									{(msg) => (
										<div className="text-red-600 text-sm mt-1">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							{/* Password Input */}
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Password:
								</label>
								<Field
									type="password"
									id="password"
									name="password"
									placeholder="Enter password (min 8 characters)"
									className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
										errors.password && touched.password
											? "border-red-500"
											: "border-gray-300"
									}`}
								/>
								<ErrorMessage name="password">
									{(msg) => (
										<div className="text-red-600 text-sm mt-1">
											{msg}
										</div>
									)}
								</ErrorMessage>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isSubmitting || loading}
								className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
									isSubmitting || loading
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700"
								}`}
							>
								{isSubmitting || loading
									? "Creating..."
									: "Create User"}
							</button>
						</Form>
					)}
				</Formik>
			</div>

			{/* ============ USERS LIST SECTION ============ */}
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
				{/* Header with title */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">
						Created Users
					</h2>
					{loading && (
						<span className="text-sm text-gray-500">
							Loading...
						</span>
					)}
				</div>

				{/* Conditional rendering based on user list state */}
				{users.length === 0 ? (
					<p className="text-center text-gray-500">
						No users yet. Create one above!
					</p>
				) : (
					<div className="space-y-4">
						{users.map((user, index) => (
							<div
								key={user.id || index}
								className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
							>
								{/* User details in a two-column grid */}
								<div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
									<span className="font-semibold text-gray-700">
										ID:
									</span>
									<span className="text-gray-900">
										{user.id}
									</span>

									<span className="font-semibold text-gray-700">
										Name:
									</span>
									<span className="text-gray-900">
										{user.first_name} {user.last_name}
									</span>

									<span className="font-semibold text-gray-700">
										Email:
									</span>
									<span className="text-gray-900">
										{user.username}
									</span>

									<span className="font-semibold text-gray-700">
										Verified:
									</span>
									<span
										className={
											user.email_verified
												? "text-green-600 font-medium"
												: "text-orange-500 font-medium"
										}
									>
										{user.email_verified
											? "✅ Yes"
											: "⏳ No"}
									</span>

									<span className="font-semibold text-gray-700">
										Created:
									</span>
									<span className="text-gray-900">
										{new Date(
											user.account_created
										).toLocaleString()}
									</span>

									<span className="font-semibold text-gray-700">
										Updated:
									</span>
									<span className="text-gray-900">
										{new Date(
											user.account_updated
										).toLocaleString()}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
