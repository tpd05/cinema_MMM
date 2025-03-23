"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import Layout from "@/app/component/layout";
import { validateLogin } from "@/lib/validation/authValidation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        console.log("Remember Me:", rememberMe);
        
        const errors = validateLogin({ username, password });
        
        if (Object.keys(errors).length > 0) {
            {Object.values(errors).map((err, index) => (
                <p key={index} className="error-message">{err}</p>
             ))}             
            setLoading(false);
            return;
        }

        try {
            const user = await login(username, password, rememberMe);

            if (user.role === "admin") {
                router.push("/admin-dashboard");
            } else {
                router.push("/client-dashboard");
            }
        } catch (err) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="login-container">
                <div className="login-box">
                    <h2 className="login-title">Login</h2>
                    {error && <p className="error-message">{error}</p>}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="text"
                            placeholder="Username"
                            className="login-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="login-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        <div className="login-options">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                />
                                Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="register-text">
                        Don't have an account?{" "}
                        <button onClick={() => router.push("/register")} className="register-link">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
