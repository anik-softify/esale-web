export type Product = {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
};

export type AuthResponse = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
