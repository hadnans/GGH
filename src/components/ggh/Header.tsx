'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ lang, onToggleLang, cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-12 w-12"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>

          {/* Logo */}
          <div className="flex flex-col items-center leading-tight shrink-0">
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--ggh-primary)' }}
            >
              GGH
            </span>
            <span className="text-xs font-medium text-gray-500">
              {isRTL ? 'جملة' : 'Gomla Go Home'}
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 mx-2 hidden sm:block">
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 size-5 ${
                  isRTL ? 'right-3' : 'left-3'
                }`}
              />
              <Input
                placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
                className={`h-12 text-lg rounded-full bg-gray-50 border-gray-200 ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>
          </div>

          {/* Language toggle */}
          <Button
            variant="outline"
            className="h-12 px-4 text-lg font-bold rounded-full border-2 shrink-0"
            style={{ borderColor: 'var(--ggh-primary)', color: 'var(--ggh-primary)' }}
            onClick={onToggleLang}
          >
            {isRTL ? 'EN' : 'عربي'}
          </Button>

          {/* Cart button */}
          <Button
            variant="ghost"
            className="relative h-12 w-12 shrink-0"
            onClick={onOpenCart}
            aria-label={isRTL ? 'السلة' : 'Cart'}
          >
            <ShoppingCart className="size-6" style={{ color: 'var(--ggh-primary)' }} />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-6 min-w-6 flex items-center justify-center text-sm font-bold text-white px-1"
                style={{ backgroundColor: 'var(--ggh-accent)' }}
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile search bar */}
        <div className="mt-3 sm:hidden">
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 size-5 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <Input
              placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
              className={`h-12 text-lg rounded-full bg-gray-50 border-gray-200 ${
                isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4">
          <nav className="flex flex-col gap-3">
            <a
              href="#categories"
              className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? '📦 الأقسام' : '📦 Categories'}
            </a>
            <a
              href="#deals"
              className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? '🔥 عروض ساخنة' : '🔥 Hot Deals'}
            </a>
            <a
              href="#products"
              className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? '🛍️ منتجات شائعة' : '🛍️ Popular Products'}
            </a>
            <a
              href="#footer"
              className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? 'اتصل بنا' : 'Contact Us'}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
