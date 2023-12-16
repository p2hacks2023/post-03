/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOSOM_API_BASE: string,
  readonly VITE_BOSOM_REALTIME_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
