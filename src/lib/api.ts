const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const { token, headers, ...rest } = options || {};

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) => apiFetch<T>(endpoint, { method: 'GET', token }),
  post: <T>(endpoint: string, data: any, token?: string) => apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token }),
  put: <T>(endpoint: string, data: any, token?: string) => apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), token }),
  delete: <T>(endpoint: string, token?: string) => apiFetch<T>(endpoint, { method: 'DELETE', token }),
  // Auth specific methods
  register: <T>(data: any) => apiFetch<T>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: <T>(data: any) => apiFetch<T>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};
