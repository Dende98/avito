import { request } from '../../../shared/api/base';

export const uploadListingImages = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  return request<string[]>('/api/uploads/images', {
    method: 'POST',
    body: formData,
    headers: {},
  });
};
