/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_BASE_URL: string;
  readonly VITE_GHL_COMPANY_ID: string;
  readonly VITE_DEFAULT_LOCATION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
