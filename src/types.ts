export interface Testimonial {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: CartItem[];
  total_price: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  images?: string[];
  category: string;
  ingredients?: string;
  nutritionalInfo?: string;
  stock?: number;
  rating?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  image?: string;
  category: 'Food Processing' | 'Professional Services';
  videoUrl?: string;
}

export interface FounderInfo {
  name: string;
  image: string;
  vision: string;
}

export interface HomepageText {
  heroHeadline: string;
  heroSubtext: string;
}

export interface AppState {
  products: Product[];
  services: Service[];
  categories: Category[];
  founder: FounderInfo;
  homepage: HomepageText;
}
