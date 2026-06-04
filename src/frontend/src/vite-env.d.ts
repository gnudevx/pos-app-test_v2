/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_AUTH?: string;
  readonly VITE_API_PRODUCTS?: string;
  readonly VITE_API_CART?: string;
  readonly VITE_API_INVENTORY?: string;
  readonly VITE_API_ORDERS?: string;
  readonly VITE_API_CHECKOUT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
