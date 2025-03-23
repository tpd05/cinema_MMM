export async function login(username, password,rememberMe) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe}),
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
    }

    return res.json();
}

export async function register(formData) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
    }

    return res.json();
}

export async function logout() {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Logout failed");
    }
}
