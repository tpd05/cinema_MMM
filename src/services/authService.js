// authService.js

// Hàm xử lý fetch với cơ chế làm mới token khi hết hạn
export async function fetchWithAuth(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: "include", // Gửi kèm cookie
    });

    if (res.status === 401) {
        // Token hết hạn, thử refresh
        try {
            await refreshToken();
            // Thử lại request sau khi refresh thành công
            const retryRes = await fetch(url, {
                ...options,
                credentials: "include",
            });
            if (!retryRes.ok) throw new Error("Failed to fetch after token refresh");
            return await retryRes.json();
        } catch (error) {
            throw new Error("Session expired. Please log in again.");
        }
    }

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Request failed");
    }

    return res.json();
}

// Hàm đăng nhập
export async function login(username, password, rememberMe) {
    return await fetchWithAuth("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
    });
}

// Hàm đăng ký
export async function register(formData) {
    return await fetchWithAuth("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
}

// Hàm làm mới token
export async function refreshToken() {
    const res = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to refresh token");
    return await res.json();
}

// Hàm đăng xuất
export async function logout() {
    return await fetchWithAuth("/api/auth/logout", {
        method: "POST",
    });
}
