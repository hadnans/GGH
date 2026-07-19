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
    <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: 'var(--ggh-border)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          {/* Logo - inline: GGH + Gomla Go Home */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--ggh-primary)' }}
            >
              GGH
            </span>
            <span className="hidden sm:inline text-sm font-medium" style={{ color: 'var(--ggh-text-secondary)' }}>
              {isRTL ? 'جملة لحد البيت' : 'Gomla Go Home'}
            </span>
          </div>

          {/* Search bar */}
          <div className="flex-1 mx-2 hidden sm:block">
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 size-4 ${
                  isRTL ? 'right-3' : 'left-3'
                }`}
                style={{ color: '#9E9E9E' }}
              />
              <Input
                placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
                className={`h-10 text-sm rounded-lg border-0 ${
                  isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
                style={{ backgroundColor: '#F5F5F5' }}
              />
            </div>
          </div>

          {/* Language toggle */}
          <Button
            variant="outline"
            className="h-9 px-3 text-sm font-semibold rounded-lg shrink-0"
            style={{ borderColor: 'var(--ggh-border)', color: 'var(--ggh-text-secondary)' }}
            onClick={onToggleLang}
          >
            {isRTL ? 'EN' : 'عربي'}
          </Button>

          {/* Cart button */}
          <Button
            variant="ghost"
            className="relative h-10 w-10 shrink-0"
            onClick={onOpenCart}
            aria-label={isRTL ? 'السلة' : 'Cart'}
          >
            <ShoppingCart className="size-5" style={{ color: 'var(--ggh-text)' }} />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-0.5 -right-0.5 h-5 min-w-5 flex items-center justify-center text-xs font-semibold text-white px-1"
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
              className={`absolute top-1/2 -translate-y-1/2 size-4 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
              style={{ color: '#9E9E9E' }}
            />
            <Input
              placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
              className={`h-10 text-sm rounded-lg border-0 ${
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
              style={{ backgroundColor: '#F5F5F5' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-3" style={{ borderColor: 'var(--ggh-border)' }}>
          <nav className="flex flex-col gap-1">
            <a
              href="#categories"
              className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? 'الأقسام' : 'Categories'}
            </a>
            <a
              href="#deals"
              className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? 'عروض ساخنة' : 'Hot Deals'}
            </a>
            <a
              href="#products"
              className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--ggh-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {isRTL ? 'المنتجات' : 'Products'}
            </a>
            <a
              href="#footer"
              className="text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
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
