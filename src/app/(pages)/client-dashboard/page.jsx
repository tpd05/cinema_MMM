"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hook/useAuth"; // Import hook
import Home from "@/app/(main)/page";

export default function ClientDashboard() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) {
        return <div></div>; 
    }

    if (!user) {
        return null;
    }

    return (
        <div>
            <Home isAuthenticated={true} />
        </div>
    );
}
