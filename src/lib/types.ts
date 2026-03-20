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
