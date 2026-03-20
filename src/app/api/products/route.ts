import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/esale";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const id = await createProduct(payload);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create product.",
      },
      { status: 500 }
    );
  }
}
