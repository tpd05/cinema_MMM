import pool from "@/lib/db/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { username, password, rememberMe } = body;
    if (!username || !password) {
        return NextResponse.json({ message: "Missing username or password" }, { status: 400 });
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM account WHERE username = ?", [username]);
        connection.release();

        if (rows.length === 0) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        const user = rows[0];

        if (!user.password_hash) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        // Tạo Access Token (15 phút)
        const accessToken = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: "15m" }
        );

        // Tạo Refresh Token (7 ngày nếu rememberMe, 1 ngày nếu không)
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
            expiresIn: rememberMe ? "7d" : "1d",
        });

        const response = NextResponse.json({ message: "Login successful", role: user.role });

        response.cookies.set("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 15 * 60,
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Database error" }, { status: 500 });
    }
}
