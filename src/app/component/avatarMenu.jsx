"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "../hook/profileContext";
import { fetchWithAuth } from "../../services/authService";

export default function AvatarMenu({ user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();

    let openProfile = () => { };
    try {
        openProfile = useProfile().openProfile;
    } catch (error) {
        console.error("Lỗi khi sử dụng useProfile:", error.message);
    }

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await fetchWithAuth("/api/auth/logout", { method: "POST" });
            onLogout();
            alert("Đăng xuất thành công!");
            router.push("/");
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
            alert("Đăng xuất thất bại, vui lòng thử lại!");
        }
    };

    return (
        <li className="avatar-container" ref={menuRef}>
            <button className="avatar" onClick={toggleMenu}>
            <img src={user?.avatar || "/avatar/default.png"} alt="User Avatar" />
            </button>
            {isMenuOpen && (
                <ul className="dropdown-menu">
                    <li>
                        <Link href="#" className="profile-button" onClick={(e) => {
                            e.preventDefault();
                            openProfile();
                        }}>
                            Profile
                        </Link>
                    </li>

                    <li>
                        <Link href="/" className="logout-button" onClick={handleLogout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            )}
        </li>
    );
}
