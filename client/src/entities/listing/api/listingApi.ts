import { request } from '../../../shared/api/base';
import type { Listing, ListingForm } from '../model/types';

export const loadListings = (params: URLSearchParams) => request<Listing[]>(`/api/listings?${params.toString()}`);

export const loadListing = (id: string) => request<Listing>(`/api/listings/${id}`);

export const loadMyListings = () => request<Listing[]>('/api/users/me/listings');

export const createListing = (form: ListingForm) =>
  request<Listing>('/api/listings', {
    method: 'POST',
    body: JSON.stringify({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      city: form.city,
      address: form.address || undefined,
      images: form.images,
      categoryId: form.categoryId,
    }),
  });

export const updateListing = (id: string, form: ListingForm) =>
  request<Listing>(`/api/listings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      city: form.city,
      address: form.address || undefined,
      images: form.images,
      categoryId: form.categoryId,
    }),
  });

export const deleteListing = (id: string) =>
  request<null>(`/api/listings/${id}`, {
    method: 'DELETE',
  });
