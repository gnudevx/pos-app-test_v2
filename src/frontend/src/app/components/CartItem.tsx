import React from 'react';

interface CartItemProps {
  item: {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onUpdateQuantity(item.product_id, newQuantity);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.product_id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product_id, item.quantity - 1);
    } else {
      onRemoveItem(item.product_id); // Optionally remove if quantity goes to 0
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
        <p className="text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDecrement}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-lg"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          -
        </button>
        <input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          aria-label={`Quantity of ${item.name}`}
        />
        <button
          onClick={handleIncrement}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-lg"
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
        <button
          onClick={() => onRemoveItem(item.product_id)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg ml-4"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;