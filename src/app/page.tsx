import Link from "next/link";
import { getProducts } from "@/lib/esale";

export default async function Home() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff3d6_0%,#fffaf0_38%,#ffffff_68%)] px-6 py-10 text-zinc-950 md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-amber-700">
                eSale Storefront
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Launch products from the admin panel and see them live here.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
                This storefront reads products directly from your ASP.NET Core
                API. Use the admin panel to create items and keep your catalog
                updated in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Open admin panel
              </Link>
              <div className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-600">
                {products.length} products live
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                Catalog
              </p>
              <h2 className="mt-2 text-3xl font-semibold">Available products</h2>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold">No products yet</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                Add your first product from the admin panel to make it appear in
                this storefront.
              </p>
              <Link
                href="/admin/products"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-amber-400"
              >
                Add first product
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
                        {product.sku}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                        {product.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    {product.description || "This product does not have a description yet."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                    <span>Stock {product.stockQuantity}</span>
                    <span>{product.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
