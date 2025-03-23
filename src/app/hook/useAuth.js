"use client";
import { useEffect, useState, useRef } from "react";

export default function useAuth() {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false); // Ngăn gọi API nhiều lần

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        console.log("Fetching user...");

        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });

                if (res.status === 401) {
                    console.warn("Unauthorized! User is not logged in.");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                if (!res.ok) {
                    throw new Error(`Lỗi khi lấy user: ${res.statusText}`);
                }

                // 🛑 Kiểm tra dữ liệu trước khi JSON.parse()
                const text = await res.text();
                console.log("API response:", text);

                if (!text.trim()) {
                    console.error("Lỗi: API trả về dữ liệu rỗng!");
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = JSON.parse(text);
                setUser(data.user || null);
            } catch (error) {
                console.error("Lỗi khi fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
    };

    return { user, setUser, loading, logout };
}
