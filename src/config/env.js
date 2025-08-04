// Environment configuration with fallbacks
export const config = {
  // Server configuration
  SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
  API_BASE_URL: (import.meta.env.VITE_SERVER_URL || 'http://localhost:5000') + '/api',
  
  // Development flags
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false,
  
  // Feature flags
  ENABLE_GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
  ENABLE_FILE_UPLOAD: import.meta.env.VITE_ENABLE_FILE_UPLOAD !== 'false',
  
  // File upload limits
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
    '.pdf', '.msg', '.eml', '.txt', '.docx', '.doc', 'image/*'
  ]
};

// Validate configuration
export const validateConfig = () => {
  const required = ['SERVER_URL', 'API_BASE_URL'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
};

export default config; 