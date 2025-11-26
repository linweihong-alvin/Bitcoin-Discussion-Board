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
	 * Automatically fetches users when the page loads
	 */
	useEffect(() => {
		// fetchUsers();
	}, []);

	/**
	 * Fetches all users from the backend via Next.js API route
	 * Updates the users state with fetched data
	 */
	async function fetchUsers(): Promise<void> {
		try {
			setLoading(true);
			console.log("🔍 Fetching users...");

			const response = await fetch("/api/users");
			const result: ApiResponse<User | User[]> = await response.json();

			console.log("📦 API Response:", result);

			if (result.success === false) {
				console.error("❌ Error:", result.message);
				alert(`Error: ${result.message}`);
				return;
			}

			const data = result.data || result;
			console.log("✅ Users data:", data);

			setUsers(Array.isArray(data) ? data : [data as User]);
		} catch (error) {
			console.error("❌ Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	}

	/**
	 * Handles form submission to create a new user
	 * Called by Formik when form is submitted and validation passes
	 */
	async function handleSubmit(
		values: FormData,
		{ setSubmitting, resetForm }: FormikHelpers<FormData>
	): Promise<void> {
		try {
			console.log("📤 Creating new user:", values);

			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			const result: ApiResponse<User> = await response.json();
			console.log("📦 API Response:", result);

			if (result.success === false) {
				console.error("❌ Error:", result.message);
				alert(`Error: ${result.message}`);
				return;
			}

			const newUser = result.data || (result as User);
			console.log("✅ User created successfully:", newUser);

			fetchUsers();
			resetForm();
			alert("User created successfully!");
		} catch (error) {
			console.error("❌ Error creating user:", error);
			alert("Failed to create user");
		} finally {
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
								disabled={isSubmitting}
								className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
									isSubmitting
										? "bg-gray-400 cursor-not-allowed"
										: "bg-blue-600 hover:bg-blue-700"
								}`}
							>
								{isSubmitting ? "Creating..." : "Create User"}
							</button>
						</Form>
					)}
				</Formik>
			</div>

			{/* ============ USERS LIST SECTION ============ */}
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
				{/* Header with title and refresh button */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-800">
						Users List
					</h2>
					<button
						onClick={fetchUsers}
						disabled={loading}
						className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
							loading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700"
						}`}
					>
						{loading ? "🔄 Loading..." : "🔄 Refresh"}
					</button>
				</div>

				{/* Conditional rendering based on loading state and data */}
				{loading ? (
					<p className="text-center text-gray-600">
						Loading users...
					</p>
				) : users.length === 0 ? (
					<p className="text-center text-gray-500">
						No users found. Create one above!
					</p>
				) : (
					<div className="space-y-4">
						{users.map((user, index) => (
							<div
								key={user.id || index}
								className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
							>
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
