import { request } from '../../../shared/api/base';
import type { Listing } from '../../listing/model/types';

export const loadCart = () => request<Listing[]>('/api/cart');

export const addToCart = (listingId: string) =>
  request<Listing>(`/api/cart/${listingId}`, {
    method: 'POST',
  });

export const removeFromCart = (listingId: string) =>
  request<null>(`/api/cart/${listingId}`, {
    method: 'DELETE',
  });

export const clearCart = () =>
  request<null>('/api/cart', {
    method: 'DELETE',
  });
