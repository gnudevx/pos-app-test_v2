const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  order_date: string; // ISO date string
  total_amount: number;
  status: string; // e.g., "completed", "pending"
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export const fetchOrders = async (token: string): Promise<Order[]> => {
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch orders');
  }

  return response.json();
};

export const fetchOrderDetail = async (orderId: string, token: string): Promise<OrderDetail> => {
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch order ${orderId} details`);
  }

  return response.json();
};