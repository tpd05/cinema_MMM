import { NextResponse } from "next/server";
import db from "@/lib/db/connect"; // Kết nối DB

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const theaterId = parseInt(searchParams.get("theaterId"), 10);
        const showtimeId = parseInt(searchParams.get("showtimeId"), 10);

        if (isNaN(theaterId) || isNaN(showtimeId)) {
            return NextResponse.json({ error: "Thiếu hoặc sai định dạng thông tin rạp hoặc suất chiếu" }, { status: 400 });
        }

        const [seats] = await db.execute(
            `SELECT s.id, s.seat_number, 
                CASE 
                    WHEN b.status = 'booked' THEN 'booked'
                    ELSE 'available'
                END AS status
            FROM seats s
            LEFT JOIN bookings b ON s.id = b.seat_id AND b.showtime_id = ?
            WHERE s.theater_id = ?`,
            [showtimeId, theaterId]
        );

        return NextResponse.json({ success: true, seats });
    } catch (error) {
        console.error("Lỗi truy vấn:", error);
        return NextResponse.json({ error: "Lỗi máy chủ, vui lòng thử lại" }, { status: 500 });
    }
}
