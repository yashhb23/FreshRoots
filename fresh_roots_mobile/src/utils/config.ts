// Environment configuration
// ⚠️ IMPORTANT: Update DEV_API_URL with your PC's LAN IP address before running
// 
// To find your LAN IP:
// 1. Open Command Prompt (cmd)
// 2. Type: ipconfig
// 3. Look for "IPv4 Address" under your active network adapter (e.g., 192.168.1.100)
// 4. Replace the IP below with your actual IP
//
// Alternative: Use adb reverse if testing via USB:
// adb reverse tcp:3000 tcp:3000
// Then you can use: http://localhost:3000/api

// Development: Your PC's local IP address + backend port
const DEV_API_URL = 'http://192.168.100.23:3000/api'; // ⚠️ UPDATE THIS WITH YOUR ACTUAL LAN IP

// Production: Deployed backend URL (Abacus endpoint)
// Swagger: https://freshroots.abacusai.app/api-docs
const PROD_API_URL = 'https://freshroots.abacusai.app/api';

export type Environment = 'development' | 'production';

// Set to 'development' or 'production'
// Debug builds use development; release builds use production.
// This keeps the APK working for real users while still allowing local dev during development.
// eslint-disable-next-line no-undef
const ENVIRONMENT: Environment = __DEV__ ? 'development' : 'production';

export const config: {
  API_BASE_URL: string;
  ENVIRONMENT: Environment;
  API_TIMEOUT: number;
} = {
  API_BASE_URL: ENVIRONMENT === 'development' ? DEV_API_URL : PROD_API_URL,
  ENVIRONMENT,
  API_TIMEOUT: 10000, // 10 seconds
};

// Helper to check if running in dev mode
export const isDevelopment = () => config.ENVIRONMENT === 'development';
export const isProduction = () => config.ENVIRONMENT === 'production';
