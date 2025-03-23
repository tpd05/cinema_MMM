import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db/connect";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req) {
    try {
        // Lấy token từ cookie Next.js
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        const userId = decoded.userId;

        // Kết nối đến database
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT 
                account.id AS account_id,
                account.username,
                account.role,
                account.created_at,
                person.id AS person_id,
                person.full_name,
                person.email,
                person.phone,
                person.address,
                person.avatar
            FROM account
            JOIN person ON account.person_id = person.id
            WHERE account.id = ?`,
            [userId]
        );
        connection.release();

        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { user: rows[0] },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
