import { NextResponse } from "next/server";
import { handleGetMovies, handleGetMovie, handleCreateMovie, handleUpdateMovie, handleDeleteMovie, handleGetNowShowingMovies, handleGetComingSoonMovies } from "@/controllers/movieController";

// Lấy danh sách phim hoặc 1 phim theo ID
export async function GET(req) {
    const { searchParams } = new URL(req.url);

    if (searchParams.has("id")) {
        return new Promise((resolve) => {
            handleGetMovie({ query: { id: searchParams.get("id") } }, {
                status: (statusCode) => ({
                    json: (data) => resolve(NextResponse.json(data, { status: statusCode }))
                })
            });
        });
    }

    const nowShowing = await new Promise((resolve) => {
        handleGetNowShowingMovies({}, {
            status: (statusCode) => ({
                json: (data) => resolve(data)
            })
        });
    });

    const comingSoon = await new Promise((resolve) => {
        handleGetComingSoonMovies({}, {
            status: (statusCode) => ({
                json: (data) => resolve(data)
            })
        });
    });

    return NextResponse.json({ nowShowing, comingSoon }, { status: 200 });
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