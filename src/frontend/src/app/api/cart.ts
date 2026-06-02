
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_price: number;
}

export interface AddToCartPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const fetchCart = async (): Promise<Cart> => {
  const response = await fetch(`${API_BASE_URL}/cart`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }
  return response.json();
};

export const addItemToCart = async (payload: AddToCartPayload): Promise<CartItem> => {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`);
  }
  return response.json();
};

export const updateCartItemQuantity = async (itemId: string, payload: UpdateCartItemPayload): Promise<CartItem> => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to update cart item quantity: ${response.statusText}`);
  }
  return response.json();
};

export const removeCartItem = async (itemId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to remove item from cart: ${response.statusText}`);
  }
};

export const clearCart = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to clear cart: ${response.statusText}`);
  }
};

export const checkoutCart = async (): Promise<{ order_id: string; total_amount: number; items: CartItem[] }> => {
  const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to checkout cart: ${response.statusText}`);
  }
  return response.json();
};