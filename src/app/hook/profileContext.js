"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const openProfile = useCallback(() => {
        console.log("Profile opened!");
        setIsProfileOpen(true);
    }, []);

    const closeProfile = useCallback(() => {
        console.log("Profile closed!");
        setIsProfileOpen(false);
    }, []);

    return (
        <ProfileContext.Provider value={{ isProfileOpen, openProfile, closeProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile phải được sử dụng bên trong ProfileProvider");
    }
    return context;
}
