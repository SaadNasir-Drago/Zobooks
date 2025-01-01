// utils/api.ts
import { getCookie } from 'cookies-next';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = getCookie('accessToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}