"use client";
import { useState } from "react";
import Link from "next/link";
import useAuth from "@/app/hook/useAuth";
import AvatarMenu from "./avatarMenu.jsx";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const getHomeLink = () => {
        if (user) {
            return user.role === "admin" ? "/admin-dashboard" : "/client-dashboard";
        }
        return "/";
    };

    return (
        <nav className="navbar">
            <div className="logo">MMM</div>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
                <li><Link href={getHomeLink()}>Home</Link></li>
                <li><Link href="#">Genre</Link></li>
                <li><Link href="#">Country</Link></li>
                <li><Link href="/movies">Movie</Link></li>
                <li><Link href="#">TV Series</Link></li>

                <li>
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                    </div>
                </li>

                {user ? (
                    <AvatarMenu user={user} onLogout={() => setUser(null)} />
                ) : (
                    <li><Link href="/login" className="active">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}