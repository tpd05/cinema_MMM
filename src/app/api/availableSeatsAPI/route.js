import db from '@/lib/db/connect';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const showtimeId = searchParams.get('showtime_id');

    if (!showtimeId) {
        return new Response(JSON.stringify({ error: 'Missing showtime_id' }), { status: 400 });
    }

    try {
        // Cập nhật trạng thái ghế thành "available" nếu suất chiếu đã kết thúc
        await db.query(
            `UPDATE bookings b
             JOIN showtimes s ON b.showtime_id = s.id
             JOIN movies m ON s.movie_id = m.id
             SET b.status = 'available' 
             WHERE b.showtime_id = ? 
             AND NOW() > (s.showtime + INTERVAL m.duration MINUTE)`, // ✅ Đã sửa start_time thành showtime
            [showtimeId]
        );

        // Truy vấn số ghế trống
        const [rows] = await db.query(
            `SELECT 
                (t.total_seats - IFNULL(b.booked_seats, 0)) AS available_seats
             FROM theaters t
             JOIN showtimes s ON t.id = s.theater_id
             LEFT JOIN (
                 SELECT showtime_id, COUNT(*) AS booked_seats
                 FROM bookings
                 WHERE status = 'booked'
                 GROUP BY showtime_id
             ) b ON s.id = b.showtime_id  -- ✅ Đã sửa s.showtime_id thành s.id
             WHERE s.id = ?`, // ✅ Đã sửa s.showtime_id thành s.id
            [showtimeId]
        );

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Showtime not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ availableSeats: rows[0].available_seats }), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
