import { getSession } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            <span className="text-amber-500">e</span>Sale Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {session.firstName} {session.lastName}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Welcome, {session.firstName}</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/products"
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-amber-500/30 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <p className="text-sm text-zinc-400">
              Manage your product catalog — add, edit, and organize inventory.
            </p>
          </Link>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 opacity-50">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-sm text-zinc-400">Coming soon</p>
          </div>
        </div>
      </div>
    </main>
  );
}
