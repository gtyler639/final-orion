// API Configuration
// Automatically detects if we're in development or production

const isDevelopment = import.meta.env.DEV

// In development, use localhost
// In production (built), use relative URLs (same origin)
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000'
  : '' // Empty string means same origin

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}
