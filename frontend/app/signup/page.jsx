"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Register user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Auto-login after signup
      await login(email, password);

      router.push("/booking");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center py-20 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900">
      {/* Heading */}
      <h1 className="text-white text-4xl font-bold mb-12 text-center">
        Welcome to RideNow
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl p-8 rounded-xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Create an Account
        </h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="First Name"
          className="w-full mb-4 p-3 rounded bg-black/30 text-white outline-none"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full mb-4 p-3 rounded bg-black/30 text-white outline-none"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black/30 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-black/30 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 py-3 rounded font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-slate-300 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Signup;
