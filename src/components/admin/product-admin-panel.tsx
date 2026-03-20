"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

const productFormSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  description: z.string().max(500, "Description is too long.").optional(),
  sku: z.string().min(2, "SKU is required."),
  price: z.coerce.number().positive("Price must be greater than zero."),
  stockQuantity: z.coerce
    .number()
    .int("Stock quantity must be a whole number.")
    .min(0, "Stock quantity cannot be negative."),
});

type ProductFormValues = z.infer<typeof productFormSchema>;
type ProductFormInput = z.input<typeof productFormSchema>;

async function loadProducts() {
  const response = await fetch("/api/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  return (await response.json()) as Product[];
}

export function ProductAdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      stockQuantity: 0,
    },
  });

  useEffect(() => {
    async function initializeProducts() {
      try {
        const initialProducts = await loadProducts();
        setProducts(initialProducts);
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : "Failed to load products."
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    void initializeProducts();
  }, []);

  const onSubmit = handleSubmit((values) => {
    setPageError(null);
    setSuccessMessage(null);

    async function submitProduct() {
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            description: values.description?.trim() || null,
          }),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          throw new Error(errorPayload?.message ?? "Failed to create product.");
        }

        reset();
        setSuccessMessage("Product created successfully.");
        const refreshedProducts = await loadProducts();
        setProducts(refreshedProducts);
      } catch (error) {
        setPageError(
          error instanceof Error ? error.message : "Failed to create product."
        );
      } finally {
        setIsSubmitting(false);
      }
    }

    void submitProduct();
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1.4fr]">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-700">
            Admin Panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            Add a new product
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Products created here will be available in the storefront list.
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">Name</span>
            <input
              {...register("name")}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              placeholder="Premium Cotton Shirt"
            />
            {errors.name ? (
              <span className="text-xs text-red-600">{errors.name.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">SKU</span>
            <input
              {...register("sku")}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              placeholder="SKU-1001"
            />
            {errors.sku ? (
              <span className="text-xs text-red-600">{errors.sku.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900">Description</span>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
              placeholder="Short product description"
            />
            {errors.description ? (
              <span className="text-xs text-red-600">
                {errors.description.message}
              </span>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-900">Price</span>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                placeholder="49.99"
              />
              {errors.price ? (
                <span className="text-xs text-red-600">
                  {errors.price.message}
                </span>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-900">
                Stock Quantity
              </span>
              <input
                {...register("stockQuantity")}
                type="number"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
                placeholder="25"
              />
              {errors.stockQuantity ? (
                <span className="text-xs text-red-600">
                  {errors.stockQuantity.message}
                </span>
              ) : null}
            </label>
          </div>

          {pageError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-amber-500 text-black hover:bg-amber-400"
          >
            {isSubmitting ? "Saving..." : "Create Product"}
          </Button>
        </form>
      </section>

      <section className="rounded-3xl border border-black/10 bg-[#131313] p-6 text-white shadow-sm">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
              Live Catalog
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Products available now
            </h2>
          </div>
          <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300">
            {products.length} items
          </span>
        </div>

        <div className="space-y-3">
          {isLoadingProducts ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-zinc-300">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-sm text-zinc-300">
              No products yet. Use the form to add your first product.
            </div>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="mt-1 text-sm text-zinc-300">{product.sku}</p>
                  </div>
                  <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm text-amber-200">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {product.description || "No description provided yet."}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <span>Stock {product.stockQuantity}</span>
                  <span>{product.isActive ? "Active" : "Inactive"}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
