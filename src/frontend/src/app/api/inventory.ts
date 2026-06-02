
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface InventoryItem {
  product_id: number;
  product_name: string;
  current_stock: number;
}

export interface AdjustStockPayload {
  quantity_change: number;
}

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory: ${response.statusText}`);
  }
  return response.json();
};

export const adjustStock = async (
  productId: number,
  payload: AdjustStockPayload
): Promise<InventoryItem> => {
  const response = await fetch(`${API_BASE_URL}/inventory/${productId}/adjust`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to adjust stock: ${response.statusText}`);
  }
  return response.json();
};