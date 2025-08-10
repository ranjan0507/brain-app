// src/pages/SignUpPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // backend register route expects username + password
      await axios.post("/api/auth/register", { username, password });
      nav("/signin");
    } catch (err: any) {
      console.error("Sign up error:", err);
      alert(err?.response?.data?.message ?? "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0f0f0f] p-6 rounded border border-neutral-800">
        <h1 className="text-2xl font-bold mb-4 text-purple-400">Sign Up</h1>
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
            autoComplete="new-password"
          />
          <button className="w-full bg-purple-500 hover:bg-purple-600 py-2 rounded text-white">
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-sm">
          Have an account? <Link to="/signin" className="text-purple-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
