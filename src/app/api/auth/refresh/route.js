import pool from "@/lib/db/connect";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST(req) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json({ message: "No refresh token provided" }, { status: 401 });
    }

    try {
        // Xác thực refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const userId = decoded.userId;

        // Kiểm tra người dùng trong DB
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM account WHERE id = ?", [userId]);
        connection.release();

        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = rows[0];

        // Tạo Access Token mới (15 phút)
        const newAccessToken = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: "15m" }
        );

        const response = NextResponse.json({ message: "Token refreshed" });
        response.cookies.set("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 15 * 60,
        });

        return response;
    } catch (error) {
        console.error("Refresh token error:", error);
        return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }
}
