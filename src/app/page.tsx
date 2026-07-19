'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { translations, type Lang } from '@/lib/ggh/i18n';
import { type Product } from '@/lib/ggh/data';
import Header from '@/components/ggh/Header';
import HeroBanner from '@/components/ggh/HeroBanner';
import CategoryGrid from '@/components/ggh/CategoryGrid';
import HotDeals from '@/components/ggh/HotDeals';
import ProductSections from '@/components/ggh/ProductSections';
import CartSlideOut, { type CartItem } from '@/components/ggh/CartSlideOut';
import Footer from '@/components/ggh/Footer';

function getInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ggh-lang');
    if (saved === 'en' || saved === 'ar') return saved;
  }
  return 'en';
}

export default function Home() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const initialized = useRef(false);

  // Set document direction and lang on mount and when lang changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (!initialized.current) {
      initialized.current = true;
    }
  }, [lang]);

  const t = translations[lang];

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('ggh-lang', newLang);
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      return newLang;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          nameEn: product.nameEn,
          nameAr: product.nameAr,
          brandEn: product.brandEn,
          brandAr: product.brandAr,
          price: product.todayPrice,
          qty: 1,
          icon: product.icon,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ggh-bg)' }}>
      {/* Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Main content */}
      <main className="flex-1">
        <HeroBanner lang={lang} t={t} />
        <CategoryGrid lang={lang} t={t} />
        <HotDeals lang={lang} t={t} />
        <ProductSections lang={lang} t={t} onAddToCart={addToCart} />
      </main>

      {/* Footer - mt-auto pushes it to bottom */}
      <div className="mt-auto">
        <Footer lang={lang} t={t} />
      </div>

      {/* Cart slide-out */}
      <CartSlideOut
        lang={lang}
        t={t}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
    </div>
  );
}
