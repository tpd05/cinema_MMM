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

    // Kiểm tra ghế hợp lệ
    const [seats] = await connection.query(
      'SELECT id FROM seats WHERE id IN (?)',
      [seat_ids]
    );

    if (seats.length !== seat_ids.length) {
      return new Response(JSON.stringify({ error: 'Invalid seats' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Kiểm tra ghế đã được đặt chưa
    const [booked] = await connection.query(
      `SELECT seat_id FROM bookings 
       WHERE showtime_id = ? AND seat_id IN (?) 
       FOR UPDATE`,
      [showtime_id, seat_ids]
    );

    if (booked.length > 0) {
      return new Response(JSON.stringify({ error: 'Seats already booked' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tính tổng tiền ($5/ghế)
    const total_price = 5 * seat_ids.length;

    // Tạo danh sách bookings
    const booking_time = new Date();
    const bookings = seat_ids.map(seat_id => [
      clientId,
      showtime_id,
      seat_id,
      5.00,
      booking_time,
      'booked'
    ]);

    // Chèn vào bảng bookings
    await connection.query(
      `INSERT INTO bookings 
       (client_id, showtime_id, seat_id, total_price, booking_time, status)
       VALUES ?`,
      [bookings]
    );

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
