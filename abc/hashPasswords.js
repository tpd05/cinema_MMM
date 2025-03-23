import pool from "../src/lib/db/connect.js"; // Đường dẫn đến file kết nối DB
import bcrypt from "bcryptjs";

async function hashPasswords() {
    const connection = await pool.getConnection();
    const [users] = await connection.query("SELECT id, password_hash FROM account");

    for (let user of users) {
        const currentPassword = user.password_hash; // Giả sử đang lưu mật khẩu thô

        // Kiểm tra nếu đã được mã hóa trước đó (bắt đầu bằng '$2a$', '$2b$'...)
        if (currentPassword.startsWith("$2a$") || currentPassword.startsWith("$2b$")) {
            console.log(`✅ User ID ${user.id} đã mã hóa, bỏ qua.`);
            continue; // Bỏ qua nếu đã mã hóa
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(currentPassword, 10);

        // Cập nhật lại vào database
        await connection.query("UPDATE account SET password_hash = ? WHERE id = ?", [hashedPassword, user.id]);

        console.log(`🔒 Đã mã hóa mật khẩu cho User ID: ${user.id}`);
    }

    connection.release();
    console.log("✅ Tất cả mật khẩu đã được mã hóa!");
}

hashPasswords().catch(console.error);
