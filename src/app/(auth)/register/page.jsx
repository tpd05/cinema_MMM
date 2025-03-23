"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";
import Layout from "@/app/component/layout";
import { validateRegistration } from "@/lib/validation/authValidation"; // Import kiểm tra đầu vào

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState({});
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        const errors = validateRegistration(formData);
        
        if (errors.full_name || errors.email || errors.phone) {
            setError(errors);
            return;
        }

        setError({});
        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        const errors = validateRegistration(formData);

        if (Object.keys(errors).length > 0) {
            setError(errors);
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
            setError({ server: err.message || "Registration failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="register-container">
                <div className="register-box">
                    <h2>Register</h2>
                    {error.server && <p className="text-red-500 mb-2">{error.server}</p>}
                    {success && <p className="text-green-500 mb-2">Registration successful! Redirecting...</p>}

                    {step === 1 ? (
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                            {error.full_name && <p className="text-red-500">{error.full_name}</p>}

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {error.email && <p className="text-red-500">{error.email}</p>}

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone (Optional)"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {error.phone && <p className="text-red-500">{error.phone}</p>}

                            <input
                                type="text"
                                name="address"
                                placeholder="Address (Optional)"
                                value={formData.address}
                                onChange={handleChange}
                            />

                            <button onClick={handleNext}>Next</button>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {error.username && <p className="text-red-500">{error.username}</p>}

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            {error.password && <p className="text-red-500">{error.password}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
