import { NextResponse } from "next/server";
import { handleGetMovies, handleGetMovie, handleCreateMovie, handleUpdateMovie, handleDeleteMovie } from "@/controllers/movieController";

// Lấy danh sách phim hoặc 1 phim theo ID
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    
    // Nếu có ID -> Lấy phim theo ID
    if (searchParams.has("id")) {
        return new Promise((resolve) => {
            handleGetMovie({ query: { id: searchParams.get("id") } }, {
                status: (statusCode) => ({
                    json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
                })
            });
        });
    }

    // Nếu không có ID -> Lấy toàn bộ danh sách phim
    return new Promise((resolve) => {
        handleGetMovies({}, {
            status: (statusCode) => ({
                json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
            })
        });
    });
}

// Thêm phim mới
export async function POST(req) {
    const body = await req.json();
    return new Promise((resolve) => {
        handleCreateMovie({ body }, {
            status: (statusCode) => ({
                json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
            })
        });
    });
}

// Cập nhật phim
export async function PUT(req) {
    const body = await req.json();
    return new Promise((resolve) => {
        handleUpdateMovie({ query: { id: body.id }, body }, {
            status: (statusCode) => ({
                json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
            })
        });
    });
}

// Xóa phim
export async function DELETE(req) {
    const body = await req.json();
    return new Promise((resolve) => {
        handleDeleteMovie({ query: { id: body.id } }, {
            status: (statusCode) => ({
                json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
            })
        });
    });
}
