export const DEMO_MODE = true;

/** API base URL: local (Uvicorn) in dev, Vercel in production */
export const API_BASE_URL = __DEV__
  ? 'http://127.0.0.1:8000'
  : 'https://synergrowth-python-api.vercel.app';
