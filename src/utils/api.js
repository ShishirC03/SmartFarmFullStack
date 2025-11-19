// src/utils/api.js
export const API_BASE = 'http://10.0.2.2:5000';

export function imageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const pathPart = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE}/${pathPart}`;
}
