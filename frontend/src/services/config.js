export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
export const API_ENDPOINT = `${API_BASE_URL}/api/${API_VERSION}`;