import { request } from '../../../shared/api/base';
import type { Listing } from '../../listing/model/types';

export const loadFavorites = () => request<Listing[]>('/api/favorites');

export const addFavorite = (listingId: string) =>
  request<Listing>(`/api/favorites/${listingId}`, {
    method: 'POST',
  });

export const removeFavorite = (listingId: string) =>
  request<null>(`/api/favorites/${listingId}`, {
    method: 'DELETE',
  });
