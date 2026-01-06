
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, CartItem, User, Product, Language, SubscriptionTier, UserRole, Order, WaitlistEntry } from '../types';
import { translations } from '../locales/translations';

interface AppContextType extends AppState {
  wishlist: Product[];
  waitlist: WaitlistEntry[];
  orders: Order[];
  addToCart: (product: Product, color: string, size: string) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateQuantity: (id: string, color: string, size: string, delta: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  joinWaitlist: (productId: string) => void;
  isOnWaitlist: (productId: string) => boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.de) => string;
  isAdmin: () => boolean;
  upgradeTier: (tier: SubscriptionTier) => void;
  incrementListingCount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    const savedUser = localStorage.getItem('swiss_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedLang = localStorage.getItem('swiss_lang') as Language;
    if (savedLang) setLanguageState(savedLang || 'de');
    const savedWaitlist = localStorage.getItem('swiss_waitlist');
    if (savedWaitlist) setWaitlist(JSON.parse(savedWaitlist));
    const savedWishlist = localStorage.getItem('swiss_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    const savedCart = localStorage.getItem('swiss_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedOrders = localStorage.getItem('swiss_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('swiss_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  const joinWaitlist = (productId: string) => {
    if (!user) return;
    setWaitlist(prev => [...prev, { productId, userId: user.id, timestamp: new Date().toISOString() }]);
  };

  const isOnWaitlist = (productId: string) => waitlist.some(w => w.productId === productId && w.userId === user?.id);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swiss_lang', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  };

  const login = (email: string, role: UserRole = 'USER') => {
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      email, 
      name: email.split('@')[0],
      role,
      isActive: true,
      membershipDate: new Date().getFullYear().toString(),
      trustScore: 100,
      tier: 'Free',
      monthlyListingsUsed: 0,
      boostCredits: 0
    };
    setUser(newUser);
    localStorage.setItem('swiss_user', JSON.stringify(newUser));
  };

  const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const t = (key: any): string => translations[language][key] || translations.de[key] || key;
  const logout = () => { setUser(null); localStorage.removeItem('swiss_user'); };
  
  const addToCart = (product: Product, color: string, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === color && item.selectedSize === size);
      if (existing) return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (id: string, color: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)));
  };

  const updateQuantity = (id: string, color: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => (item.id === id && item.selectedColor === color && item.selectedSize === size) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) setWishlist(prev => [...prev, product]);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      cart, wishlist, waitlist, orders, user, isLoading, language, isAdmin,
      addToCart, removeFromCart, updateQuantity, addToWishlist, removeFromWishlist, isInWishlist,
      joinWaitlist, isOnWaitlist,
      login, logout, clearCart: () => setCart([]), addOrder, setLanguage, t,
      upgradeTier: (tier) => {}, incrementListingCount: () => {}
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
