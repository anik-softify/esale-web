import Link from "next/link";
import { ProductAdminPanel } from "@/components/admin/product-admin-panel";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_45%,#fffaf2_100%)] px-6 py-10 text-zinc-950 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-amber-700">
              eSale Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Product management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
              Create products from the admin panel and see them appear in the
              storefront immediately after refresh.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-950"
          >
            Open storefront
          </Link>
        </div>

        <ProductAdminPanel />
      </div>
    </main>
  );
}
