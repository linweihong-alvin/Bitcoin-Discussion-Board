"use client"; // tell next.js this is client Component, so can use react hook

import Link from "next/link";
import { useSearchParams } from "next/navigation"; // react hook

interface PaginationProps {
	totalPages: number;
}

const Pagination = ({ totalPages }: PaginationProps) => {
	// get page number from url (localhost:3000/?page=xxx)
	const currentPage = useSearchParams().get("page") || "1";
	return (
		<div
			// only flex: make each element in a row
			// gap-4: gap 4*4 = 16 px between each page number
			className="flex gap-4 text-sm font-semibold"
		>
			{Array.from({ length: totalPages }).map((_, index) => (
				// Array.from({ length: 10}) create an array with 10 elements
				// .map((_, index) => ...): don't need element, only need index of each element
				// index start from 0
				<Link
					href={`?page=${index + 1}`}
					key={index}
					// highlight the current page (make other page number transparent)
					// className = {`${...}`}
					// ===: strict equality => 1 === "1";  // false  (number vs string)
					// ==: loose equality   => 1 == "1";   // true
					// in modern JavaScript/TypeScript, you almost always want to use === instead of ==.
					className={`${currentPage === `${index + 1}` ? "text-white" : "text-white/50"}`}
				>
					{index + 1}
				</Link>
			))}
		</div>
	);
};

export default Pagination;
