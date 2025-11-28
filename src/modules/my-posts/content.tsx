import { prisma } from "@/lib/prisma";
import ClientWrapper from "./client-wrapper";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const MyPostsContent = async () => {
	// 注意：這裡簡化了驗證邏輯
	// 需要從 session 或 cookie 獲取用戶資訊
	// 假設會在客戶端傳遞 userId
	// 目前: get user info from localstorage (not secure, user can modify)
	// todo: use authentication

	return <ClientWrapper />;
};

export default MyPostsContent;
