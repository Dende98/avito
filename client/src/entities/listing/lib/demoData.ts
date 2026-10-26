import type { Category } from '../../category/model/types';
import type { Listing } from '../model/types';

export const fallbackCategories: Category[] = [
  { id: 'demo-electronics', name: 'Электроника', slug: 'electronics', _count: { listings: 1 } },
  { id: 'demo-transport', name: 'Транспорт', slug: 'transport', _count: { listings: 1 } },
  { id: 'demo-home', name: 'Для дома', slug: 'home', _count: { listings: 1 } },
  { id: 'demo-real-estate', name: 'Недвижимость', slug: 'real-estate', _count: { listings: 0 } },
];

export const fallbackListings: Listing[] = [
  {
    id: 'demo-1',
    title: 'MacBook Air M2 13"',
    description: 'Легкий ноутбук для учебы и работы, батарея держит весь день.',
    price: 74000,
    city: 'Москва',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'],
    views: 128,
    createdAt: new Date().toISOString(),
    category: { id: 'demo-electronics', name: 'Электроника', slug: 'electronics' },
    seller: { id: 'demo-seller', name: 'Мария', city: 'Москва', phone: '+7 900 000-00-00' },
  },
  {
    id: 'demo-2',
    title: 'Диван Scandinavia',
    description: 'Ткань без пятен, раскладывается, самовывоз сегодня дешевле.',
    price: 28000,
    city: 'Казань',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'],
    views: 76,
    createdAt: new Date().toISOString(),
    category: { id: 'demo-home', name: 'Для дома', slug: 'home' },
    seller: { id: 'demo-seller-2', name: 'Илья', city: 'Казань' },
  },
  {
    id: 'demo-3',
    title: 'Toyota Camry 2019',
    description: 'ПТС оригинал, бережная эксплуатация, история обслуживания.',
    price: 2470000,
    city: 'Санкт-Петербург',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80'],
    views: 341,
    createdAt: new Date().toISOString(),
    category: { id: 'demo-transport', name: 'Транспорт', slug: 'transport' },
    seller: { id: 'demo-seller-3', name: 'Олег', city: 'Санкт-Петербург' },
  },
];
