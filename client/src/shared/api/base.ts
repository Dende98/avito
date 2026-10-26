export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
};

const TOKEN_KEY = 'delta_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const buildRequestInit = (init?: RequestInit): RequestInit => {
  const token = tokenStorage.get();
  const isFormData = init?.body instanceof FormData;

  return {
    ...init,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  };
};

const refreshAccessToken = async () => {
  const response = await fetch('/api/auth/refresh', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    tokenStorage.clear();
    return false;
  }

  const payload = (await response.json()) as ApiResponse<{ accessToken: string }>;
  tokenStorage.set(payload.data.accessToken);
  return true;
};

export const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  let response = await fetch(url, buildRequestInit(init));
  let payload = (await response.json()) as ApiResponse<T>;

  if (response.status === 403 && !url.startsWith('/api/auth/')) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await fetch(url, buildRequestInit(init));
      payload = (await response.json()) as ApiResponse<T>;
    }
  }

  if (!response.ok) {
    throw new Error(payload.message || 'Ошибка запроса');
  }

  return payload.data;
};
