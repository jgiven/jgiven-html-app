/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LOAD_SAMPLE_REPORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
