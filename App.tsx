
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/context';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminConsole from './pages/AdminConsole';
import PrecisionLoader from './components/PrecisionLoader';
import ResaleProtocol from './pages/ResaleProtocol';
import AtelierVision from './pages/AtelierVision';
import QuantumDesign from './pages/QuantumDesign';
import Boutiques from './pages/Boutiques';
import GiftProtocol from './pages/GiftProtocol';
import Checkout from './pages/Checkout';
import Editorial from './pages/Editorial';

const App: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) return <PrecisionLoader />;

  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/resale" element={<ResaleProtocol />} />
            <Route path="/vision" element={<AtelierVision />} />
            <Route path="/quantum" element={<QuantumDesign />} />
            <Route path="/boutiques" element={<Boutiques />} />
            <Route path="/gift" element={<GiftProtocol />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
