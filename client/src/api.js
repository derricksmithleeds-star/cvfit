const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function apiUrl(path) {
  return `${BASE_URL}${path}`;
}
