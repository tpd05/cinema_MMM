import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || '',
  port: process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : null,
});

// Kiểm tra kết nối khi khởi chạy server
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối tới cơ sở dữ liệu thành công');
    connection.release();
  } catch (error) {
    console.error('❌ Kết nối tới cơ sở dữ liệu thất bại:', error.message);
  }
})();

export default pool;
