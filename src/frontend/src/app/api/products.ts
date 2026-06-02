
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ProductCreate {
  name: string;
  price: number;
  stock: number;
}

export interface ProductUpdate {
  name?: string;
  price?: number;
  stock?: number;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  return response.json();
}

export async function createProduct(product: ProductCreate): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create product: ${errorData.detail || response.statusText}`);
  }
  return response.json();
}

export async function updateProduct(id: number, product: ProductUpdate): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update product: ${errorData.detail || response.statusText}`);
  }
  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to delete product: ${errorData.detail || response.statusText}`);
  }
}