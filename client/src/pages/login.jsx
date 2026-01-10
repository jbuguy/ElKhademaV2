import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useLogin();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                                {error?.response?.data?.error ||
                                    "Login failed. Please try again."}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn text-white bg-green-500 w-full"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-sm text-gray-500">
                        Or continue with
                    </span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="mt-6">
                    <GoogleLoginButton />
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="text-primary-600 font-semibold hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
