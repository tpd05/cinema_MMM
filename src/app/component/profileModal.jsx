"use client";
import { useEffect, useState } from "react";
import { useProfile } from "../hook/profileContext";

export default function ProfileModal() {
    const { isProfileOpen, closeProfile } = useProfile();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isProfileOpen) {
            setLoading(true);
            fetch("/api/auth/me", { method: "GET", credentials: "include" })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Dữ liệu từ API:", data); 
                    if (data.user) {
                        setUserData(data.user);
                    } else {
                        setError("Không thể lấy thông tin.");
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Lỗi khi gọi API:", err);
                    setError("Lỗi kết nối.");
                    setLoading(false);
                });
        }
    }, [isProfileOpen]);


    if (!isProfileOpen) return null;

    return (
        <div className="profile-modal">
            <div className="profile-content">
                <h2 className="profile-h2">PROFILE</h2>

                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="profile-details">
                        <div className="profile-avatar">
                            <img src={userData.avatar ? `/avatar/${userData.avatar}` : "/avatar/default.png"} alt="Avatar" />
                        </div>
                        <div className="profile-info">
                        <div className="profile-item">
                            <label>User name:</label>
                            <span>{userData.username}</span>
                        </div>
                        <div className="profile-item">
                            <label>Full name:</label>
                            <span>{userData.full_name}</span>
                        </div>
                        <div className="profile-item">
                            <label>Email:</label>
                            <span>{userData.email}</span>
                        </div>
                        <div className="profile-item">
                            <label>Phone number:</label>
                            <span>{userData.phone}</span>
                        </div>
                        <div className="profile-item">
                            <label>Address:</label>
                            <span>{userData.address}</span>
                        </div>
                        </div>
                    </div>
                )}

                <button className="close-button" onClick={closeProfile}>x</button>
            </div>
        </div>
    );
}
