import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" });

    response.cookies.set("accessToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    response.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });

    return response;
}

export async function DELETE() {
    return await POST(); 
}
