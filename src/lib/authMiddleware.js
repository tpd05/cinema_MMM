import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

export function middleware(req) {
    const accessToken = req.cookies.get("token")?.value;

    if (!accessToken) {
        // Lưu đường dẫn hiện tại để chuyển hướng sau khi login
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        if (decoded.exp * 1000 < Date.now()) {
            throw new Error("Token expired");
        }
    } catch (error) {
        console.error("Authentication error:", error.message);
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Áp dụng middleware cho các route cụ thể
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"], // Bảo vệ các trang này
};
