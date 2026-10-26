import type { Category } from '../../category/model/types';

export type Seller = {
  id: string;
  name: string;
  city: string;
  email?: string;
  phone?: string;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  address?: string;
  images: string[];
  views: number;
  createdAt: string;
  category: Category;
  seller: Seller;
};

export type ListingForm = {
  title: string;
  description: string;
  price: string;
  city: string;
  address: string;
  images: string[];
  categoryId: string;
};
