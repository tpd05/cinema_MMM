import pool from "@/lib/db/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
    let connection;
    try {
        // Lấy dữ liệu từ request
        const { full_name, email, phone, address, username, password } = await req.json();

        // Kiểm tra trường bắt buộc
        if (!full_name || !email || !username || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        // Kết nối database
        connection = await pool.getConnection();
        if (!connection) {
            return NextResponse.json({ message: "Database connection error" }, { status: 500 });
        }

        // Bắt đầu transaction
        await connection.beginTransaction();

        // Kiểm tra email và username có tồn tại không
        const [existingUsers] = await connection.query(
            "SELECT email FROM person WHERE LOWER(email) = LOWER(?) UNION SELECT username FROM account WHERE LOWER(username) = LOWER(?)",
            [email, username]
        );

        for (const user of existingUsers) {
            if (user.email?.toLowerCase() === email.toLowerCase()) {
                await connection.rollback();
                return NextResponse.json({ message: "Email already exists" }, { status: 409 });
            }
            if (user.username?.toLowerCase() === username.toLowerCase()) {
                await connection.rollback();
                return NextResponse.json({ message: "Username already exists" }, { status: 409 });
            }
        }

        // Chèn dữ liệu vào bảng person
        const [personResult] = await connection.query(
            "INSERT INTO person (full_name, email, phone, address) VALUES (?, ?, ?, ?)",
            [full_name, email, phone, address]
        );
        const personId = personResult.insertId;
        if (!personId) throw new Error("Failed to insert person data");


        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm user vào bảng account
        await connection.query(
            "INSERT INTO account (person_id, username, password_hash, role) VALUES (?, ?, ?, 'client')",
            [personId, username, hashedPassword]
        );

        // Commit transaction
        await connection.commit();

        // Tạo JWT token
        const token = jwt.sign({ userId: personId, username, role: "client" }, SECRET_KEY, { expiresIn: "15m" });

        // Lưu token vào HTTP-only Cookie
        const response = NextResponse.json({ message: "Registration successful" });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 15 * 60,
        });

        return response;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Database error", error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
