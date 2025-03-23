import { NextResponse } from "next/server";
import db from "@/lib/db/connect"; // Kết nối MySQL

// Lấy danh sách rạp hoặc 1 rạp theo ID
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        const query = id 
            ? "SELECT * FROM theaters WHERE id = ?" 
            : "SELECT * FROM theaters";
        const params = id ? [id] : [];

        const [result] = await db.execute(query, params);

        if (id && result.length === 0) {
            return NextResponse.json({ error: "Không tìm thấy rạp" }, { status: 404 });
        }

        return NextResponse.json(id ? result[0] : result);
    } catch (error) {
        return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
    }
}



// Thêm rạp mới
export async function POST(req) {
    try {
        const { name, location, total_seats } = await req.json();
        if (!name || !location || !total_seats) {
            return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
        }

        const [result] = await db.execute(
            "INSERT INTO theaters (name, location, total_seats, created_at) VALUES (?, ?, ?, NOW())",
            [name, location, total_seats]
        );

        return NextResponse.json({ success: "Thêm thành công", id: result.insertId });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi khi thêm rạp" }, { status: 500 });
    }
}

// Cập nhật rạp chiếu
export async function PUT(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    try {
        const { name, location, total_seats } = await req.json();
        const [result] = await db.execute(
            "UPDATE theaters SET name = ?, location = ?, total_seats = ? WHERE id = ?",
            [name, location, total_seats, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Không tìm thấy rạp để cập nhật" }, { status: 404 });
        }

        return NextResponse.json({ success: "Cập nhật thành công" });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi khi cập nhật rạp" }, { status: 500 });
    }
}

// Xóa rạp chiếu
export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    try {
        const [result] = await db.execute("DELETE FROM theaters WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Không tìm thấy rạp để xóa" }, { status: 404 });
        }

        return NextResponse.json({ success: "Xóa thành công" });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi khi xóa rạp" }, { status: 500 });
    }
}