import db from '@/lib/db/connect';

export async function POST(req) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Lấy account_id và các thông tin khác từ request
    const { account_id, showtime_id, seat_ids } = await req.json();

    // Kiểm tra đầu vào
    if (
      typeof account_id !== 'number' ||
      typeof showtime_id !== 'number' ||
      !Array.isArray(seat_ids) ||
      seat_ids.length === 0
    ) {
      return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Lấy client_id từ account_id
    const [client] = await connection.query(
      'SELECT id FROM client WHERE account_id = ?',
      [account_id]
    );

    if (!client.length) {
      return new Response(JSON.stringify({ error: 'Client not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const clientId = client[0].id;

    // Kiểm tra ghế đã được đặt cho suất chiếu đó chưa
    const [existingBookings] = await connection.query(
      `SELECT seat_id FROM bookings
   WHERE showtime_id = ? AND seat_id IN (?)`,
      [showtime_id, seat_ids]
    );

    if (existingBookings.length > 0) {
      return new Response(JSON.stringify({ error: 'One or more seats are already booked' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }


    // Tính tổng tiền ($5/ghế)
    const total_price = 5 * seat_ids.length;

    // Tạo danh sách bookings
    const booking_time = new Date();

    for (const seat_id of seat_ids) {
      await connection.query(
        `INSERT INTO bookings (client_id, showtime_id, seat_id, total_price, booking_time, status)
         VALUES (?, ?, ?, ?, ?, 'booked')
         ON DUPLICATE KEY UPDATE 
         client_id = VALUES(client_id),
         total_price = VALUES(total_price),
         booking_time = VALUES(booking_time),
         status = 'booked'`,
        [clientId, showtime_id, seat_id, 5.00, booking_time]
      );
    }

    await connection.commit();
    return new Response(JSON.stringify({
      message: 'Booking successful',
      total_price: `${total_price.toFixed(2)} USD`,
      seats: seat_ids
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Booking error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    connection.release();
  }
}
