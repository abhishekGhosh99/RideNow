"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="min-h-screen flex flex-col items-center py-20 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900">
      {/* // Add heading in Login and signup page ✅
      // Create Signup page ✅
      // Login page heading = Welcome back ✅
      // Signup page heading = Welcome to RideNow ✅
      // On Login page there will be a link to go to the signup page so user can
      signup if user doesn't have a account. ✅ */}
      <h1 className="text-white text-4xl font-bold mb-12 ">
        Welcome back to RideNow
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          Login
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black/30 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-black/30 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded font-semibold">
          Login
        </button>

        <p className="mt-6 text-sm text-slate-300 text-center">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
