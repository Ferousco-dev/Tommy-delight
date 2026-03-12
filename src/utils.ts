import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WHATSAPP_NUMBER_1 = '2347010140402';
export const WHATSAPP_NUMBER_2 = '2349064006409';

export const getWhatsAppLink = (number: string, message: string) => {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export function getProxiedImageUrl(url: string) {
  if (!url) return '';
  // If it's already proxied by wsrv.nl, don't proxy again
  if (url.includes('wsrv.nl')) return url;
  
  // Proxy catbox.moe images to bypass hotlinking/CORS issues
  if (url.includes('catbox.moe')) {
    // Using wsrv.nl with auto-format
    const encodedUrl = encodeURIComponent(url);
    return `https://wsrv.nl/?url=${encodedUrl}&af`;
  }
  return url;
}

export async function safeFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || `Error ${response.status}`);
      }
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text.includes('<!DOCTYPE html>') ? `Server Error (${response.status})` : text || `Error ${response.status}`);
      }
      // If it's OK but not JSON, return the text
      return text;
    }
  } catch (error: any) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
