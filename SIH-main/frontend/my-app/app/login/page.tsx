"use client";

import { useState } from "react";
import { useRole, Role } from "../context/RoleContext";

export default function LoginPage() {
  const { login } = useRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      login(data.role as Role);
    } catch (err) {
      setError("Invalid credentials. Try admin/admin, hospital/hospital, or vendor/vendor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">PharmaChain</h1>
          <p className="text-sm text-slate-500 mt-1">Supply Chain OS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center font-medium">Demo Credentials:</p>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between"><span>System Admin:</span> <code className="bg-slate-100 px-1 rounded">admin / admin</code></div>
            <div className="flex justify-between"><span>Hospital Admin:</span> <code className="bg-slate-100 px-1 rounded">hospital / hospital</code></div>
            <div className="flex justify-between"><span>Vendor Partner:</span> <code className="bg-slate-100 px-1 rounded">vendor / vendor</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
