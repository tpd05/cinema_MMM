import { NextResponse } from "next/server";
import db from "@/lib/db/connect"; // Kết nối MySQL

export async function GET(req) {
    try {
        // Lấy movie_id từ query
        const { searchParams } = new URL(req.url);
        const movie_id = searchParams.get("movie_id");

        if (!movie_id) {
            return NextResponse.json({ error: "Thiếu movie_id" }, { status: 400 });
        }

        // Truy vấn danh sách suất chiếu từ bảng `showtimes`
        const [showtimes] = await db.query(
            "SELECT id, theater_id, showtime FROM showtimes WHERE movie_id = ? ORDER BY showtime ASC",
            [movie_id]
        );

        return NextResponse.json(showtimes, { status: 200 });
    } catch (error) {
        console.error("Lỗi lấy suất chiếu:", error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
