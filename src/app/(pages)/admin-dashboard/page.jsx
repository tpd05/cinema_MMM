"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hook/useAuth";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user || user.role !== "admin") {
        router.push("/login");
        return null;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Chào mừng Admin!</p>
        </div>
    );
}
