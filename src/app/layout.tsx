// Main page
// import type from next module (to check type of metadata, e.g. title should be string type)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // two types of font
import "./globals.css";

// font for Normal paragraphs, Buttons, menus
const geistSans = Geist({
	variable: "--font-geist-sans", // gen a var used in css
	subsets: ["latin"],
});

// font for Code blocks, Numbers in tables
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Bitconin Forum",
	description: "Bitconin Forum",
};

// next.js see this as a component of root layout of this website
// render each sub page (children) under root layout
// every page in the app is rendered as `children` inside this layout.
// get para children from each page (get page.tsx contents based on url)
// set children's ts type def as Readonly
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		// jsx syntax (html tag)
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
