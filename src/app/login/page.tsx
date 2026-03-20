"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign in to eSale</h1>
          <p className="mt-2 text-zinc-400">
            Enter your credentials to continue
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-amber-500 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-500 hover:text-amber-400">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
