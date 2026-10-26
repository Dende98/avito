import { request } from '../../../shared/api/base';
import type { Category } from '../model/types';

export const loadCategories = () => request<Category[]>('/api/categories');
