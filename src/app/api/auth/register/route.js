import pool from "@/lib/db/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
    let connection;
    try {
        const { full_name, email, phone, address, username, password } = await req.json();
        if (!full_name || !email || !username || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        connection = await pool.getConnection();
        if (!connection) {
            return NextResponse.json({ message: "Database connection error" }, { status: 500 });
        }

        // Bắt đầu transaction
        await connection.beginTransaction();

        // Kiểm tra email đã tồn tại chưa (case-insensitive)
        const [existingUsers] = await connection.query("SELECT 1 FROM person WHERE LOWER(email) = LOWER(?)", [email]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        // Kiểm tra username đã tồn tại chưa (case-insensitive)
        const [existingAccounts] = await connection.query("SELECT 1 FROM account WHERE LOWER(username) = LOWER(?)", [username]);
        if (existingAccounts.length > 0) {
            await connection.rollback();
            return NextResponse.json({ message: "Username already exists" }, { status: 409 });
        }

        // Chèn dữ liệu vào bảng person
        const [personResult] = await connection.query(
            "INSERT INTO person (full_name, email, phone, address) VALUES (?, ?, ?, ?)",
            [full_name, email, phone, address]
        );
        const personId = personResult.insertId;
        if (!personId) throw new Error("Failed to insert person data");

        // Chèn dữ liệu vào bảng client
        await connection.query(
            "INSERT INTO client (person_id, membership) VALUES (?, 'regular')",
            [personId]
        );

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm user vào bảng account
        await connection.query(
            "INSERT INTO account (person_id, username, password_hash, role) VALUES (?, ?, ?, 'client')",
            [personId, username, hashedPassword]
        );

        // Commit transaction
        await connection.commit();

        // Tạo JWS token
        const token = jwt.sign({ userId: personId, username, role: "client" }, SECRET_KEY, { expiresIn: "15m" });

        // Lưu token vào HTTP-only Cookie
        const response = NextResponse.json({ message: "Registration successful" });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", // Đổi từ "Strict" → "Lax"
            maxAge: 15 * 60, // 15 phút
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
