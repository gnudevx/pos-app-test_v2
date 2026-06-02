
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const processCheckout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed, e.g., 'Authorization': `Bearer ${token}`
      },
      // Assuming the backend infers cart from session/user token, no body needed
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process checkout');
    }

    // Assuming a successful checkout returns a simple success message or receipt ID
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
};