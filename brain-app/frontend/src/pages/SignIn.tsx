// src/pages/SignInPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      // backend returns token under `token`
      const token = res.data?.token ?? res.data?.accessToken ?? null;
      if (!token) throw new Error("No token in response");
      localStorage.setItem("token", token);
      nav("/");
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0f0f0f] p-6 rounded border border-neutral-800">
        <h1 className="text-2xl font-bold mb-4 text-purple-400">Sign In</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 bg-neutral-900 rounded border border-neutral-700"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            type="password"
            className="w-full p-2 bg-neutral-900 rounded border border-neutral-700"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button className="w-full bg-purple-500 hover:bg-purple-600 py-2 rounded text-white">
            Sign In
          </button>
        </form>
        <p className="mt-3 text-sm">
          No account? <Link to="/signup" className="text-purple-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
