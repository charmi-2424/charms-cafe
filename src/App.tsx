import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/ToastContainer';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const MenuPage = React.lazy(() => import('./pages/MenuPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  </div>
);

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <BrowserRouter>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 btn-primary z-[200]">
        Skip to content
      </a>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
              <p className="text-6xl">☕</p>
              <h1 className="text-3xl font-serif text-espresso">Page not found</h1>
              <a href="/" className="btn-primary">Back to Home</a>
            </div>
          } />
        </Routes>
      </Suspense>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
}

export default App;
