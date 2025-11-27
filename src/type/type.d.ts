interface Post {
	id: string;
	title: string;
	content: string;
	createdAt: number;
	author?: {
		id: number;
		username: string;
	};
}

interface User {
	id: number;
	username: string;
	email: string;
}

interface ApiResponse<T> {
	status: number;
	message: string;
	data: T;
}
