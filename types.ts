
export type Language = 'de' | 'fr' | 'it' | 'fa';
export type SubscriptionTier = 'Free' | 'Pro' | 'Unlimited' | 'Circle_VIP';
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface WaitlistEntry {
  productId: string;
  userId: string;
  timestamp: string;
}

export interface SustainabilityMetrics {
  carbonFootprint: number;
  waterSaved: number;
  ethicalScore: number;
  originCoords: { lat: number; lng: number };
}

// Added Review interface to support product reviews
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  isVerifiedPurchase: boolean;
  comment: Record<Language, string>;
}

// Added AdminActionLog interface for audit trailing
export interface AdminActionLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'UPDATE_PRICE' | 'UPDATE_STOCK' | 'REMOVE_PRODUCT';
  productId: string;
  productName: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  membershipDate?: string;
  trustScore: number;
  tier: SubscriptionTier;
  monthlyListingsUsed: number;
  boostCredits: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'DISPATCHED' | 'ARCHIVED' | 'IN_TRANSIT';
}

export interface Product {
  id: string;
  name: Record<Language, string>;
  price: number;
  stock: number;
  isActive: boolean;
  category: 'Men' | 'Women' | 'Kids' | 'Accessories';
  description: Record<Language, string>;
  images: string[];
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  featured?: boolean;
  sellerTrustScore?: number;
  sustainability?: SustainabilityMetrics;
  // Added reviews property to fix TS error in constants.tsx
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface AppState {
  cart: CartItem[];
  user: User | null;
  isLoading: boolean;
  language: Language;
}
