import { request } from '../../../shared/api/base';
import type { AuthResult, User } from '../model/types';

export const register = (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}) =>
  request<AuthResult>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const login = (payload: { email: string; password: string }) =>
  request<AuthResult>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loadCurrentUser = () => request<User>('/api/auth/me');

export const refreshSession = () =>
  request<AuthResult>('/api/auth/refresh', {
    method: 'POST',
  });

export const logout = () =>
  request<null>('/api/auth/logout', {
    method: 'POST',
  });
