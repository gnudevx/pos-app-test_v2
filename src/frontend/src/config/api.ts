const SERVICES = {
  auth:      import.meta.env.VITE_AUTH_URL      || 'http://localhost:8001',
  products:  import.meta.env.VITE_PRODUCTS_URL  || 'http://localhost:8002',
  cart:      import.meta.env.VITE_CART_URL      || 'http://localhost:8003',
  inventory: import.meta.env.VITE_INVENTORY_URL || 'http://localhost:8004',
  orders:    import.meta.env.VITE_ORDERS_URL    || 'http://localhost:8005',
  checkout:  import.meta.env.VITE_CHECKOUT_URL  || 'http://localhost:8006',
};

export default SERVICES;