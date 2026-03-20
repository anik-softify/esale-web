import { AuthResponse, CreateProductInput, LoginInput, Product, RegisterInput } from "@/lib/types";

const DEFAULT_TENANT_ID = "11111111-1111-1111-1111-111111111111";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function resolveApiBaseUrl() {
  const baseUrl =
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost";

  return trimTrailingSlash(baseUrl);
}

function resolveTenantId() {
  return process.env.NEXT_PUBLIC_TENANT_ID ?? DEFAULT_TENANT_ID;
}

function resolveOptionalHostHeader() {
  return process.env.API_HOST_HEADER;
}

async function requestEsale<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("X-Tenant-Id", resolveTenantId());

  const hostHeader = resolveOptionalHostHeader();
  if (hostHeader) {
    headers.set("Host", hostHeader);
  }

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function getProducts() {
  return requestEsale<Product[]>("/api/products", {
    method: "GET",
  });
}

export async function createProduct(input: CreateProductInput) {
  return requestEsale<string>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: LoginInput) {
  return requestEsale<AuthResponse>("/api/account/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerUser(input: RegisterInput) {
  return requestEsale<AuthResponse>("/api/account/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
