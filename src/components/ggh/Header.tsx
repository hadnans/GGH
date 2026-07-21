'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, Menu, X, User, Globe, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { useLangStore } from '@/stores/lang-store';
import { useAuthStore } from '@/stores/auth-store';
import { t } from '@/lib/ggh/i18n';
import { type Lang } from '@/types/ggh';

interface HeaderProps {
  lang?: Lang;
  onToggleLang?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onSearchClick?: () => void;
  onAccountClick?: () => void;
  onOrdersClick?: () => void;
  isAuthenticated?: boolean;
  customerName?: string;
}

export default function Header({
  onSearchClick,
  onAccountClick,
  onOrdersClick,
}: HeaderProps) {
  const { lang, isRTL, toggleLang } = useLangStore();
  const { getItemCount, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartCount = getItemCount();

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      onSearchClick?.();
    }
  }, [searchQuery, onSearchClick]);

  const navLinks = [
    { href: '#categories-section', label: t(lang, 'categories') },
    { href: '#deals', label: t(lang, 'hotDeals') },
    { href: '#products', label: t(lang, 'popularProducts') },
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b"
      style={{ borderColor: 'var(--ggh-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            className="lg:hidden h-12 w-12 shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t(lang, 'menuToggle')}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-1.5 shrink-0" aria-label="GGH Home">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--ggh-primary)' }}
            >
              GGH
            </span>
            <span
              className="hidden sm:inline text-sm font-medium"
              style={{ color: 'var(--ggh-text-secondary)' }}
            >
              {isRTL ? 'جملة لحد البيت' : 'Gomla Go Home'}
            </span>
          </a>

          {/* Desktop search bar */}
          <button
            onClick={onSearchClick}
            className="flex-1 mx-2 hidden sm:block"
          >
            <div className="relative">
              <Search
                className="absolute top-1/2 -translate-y-1/2 size-4"
                style={{
                  color: '#9E9E9E',
                  [isRTL ? 'right' : 'left']: '12px',
                }}
              />
              <div
                className="h-12 text-base rounded-lg flex items-center"
                style={{
                  backgroundColor: '#F5F5F5',
                  [isRTL ? 'paddingRight' : 'paddingLeft']: '40px',
                  [isRTL ? 'paddingLeft' : 'paddingRight']: '16px',
                  color: '#9E9E9E',
                }}
              >
                {t(lang, 'search')}
              </div>
            </div>
          </button>

          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            className="sm:hidden h-12 w-12 shrink-0"
            onClick={onSearchClick}
            aria-label={t(lang, 'search')}
          >
            <Search className="size-5" style={{ color: 'var(--ggh-text)' }} />
          </Button>

          {/* Language toggle */}
          <Button
            variant="outline"
            className="h-12 px-3 text-sm font-semibold rounded-lg shrink-0"
            style={{ borderColor: 'var(--ggh-border)', color: 'var(--ggh-text-secondary)' }}
            onClick={toggleLang}
            aria-label={t(lang, 'languageSwitch')}
          >
            <Globe className="size-4 me-1.5" />
            {isRTL ? 'EN' : 'عربي'}
          </Button>

          {/* Orders button (desktop) */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="hidden lg:flex h-12 w-12 shrink-0"
              onClick={onOrdersClick}
              aria-label={t(lang, 'orders')}
            >
              <Package className="size-5" style={{ color: 'var(--ggh-text)' }} />
            </Button>
          )}

          {/* Cart button */}
          <Button
            variant="ghost"
            className="relative h-12 w-12 shrink-0"
            onClick={openCart}
            aria-label={t(lang, 'cartWithItems', { n: cartCount })}
          >
            <ShoppingCart className="size-5" style={{ color: 'var(--ggh-text)' }} />
            {cartCount > 0 && (
              <Badge
                className="absolute -top-0.5 h-5 min-w-5 flex items-center justify-center text-xs font-semibold text-white px-1 border-0"
                style={{
                  backgroundColor: 'var(--ggh-accent)',
                  [isRTL ? 'left' : 'right']: '-2px',
                }}
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Account icon */}
          <Button
            variant="ghost"
            className="h-12 w-12 shrink-0"
            onClick={onAccountClick}
            aria-label={t(lang, 'account')}
          >
            <User className="size-5" style={{ color: 'var(--ggh-text)' }} />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t bg-white"
            style={{ borderColor: 'var(--ggh-border)' }}
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center"
                  style={{ color: 'var(--ggh-text)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {isAuthenticated ? (
                <>
                  <button
                    className="text-base font-medium py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center w-full text-start"
                    style={{ color: 'var(--ggh-text)' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOrdersClick?.();
                    }}
                  >
                    {t(lang, 'orders')}
                  </button>
                  <button
                    className="text-base font-medium py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center w-full text-start"
                    style={{ color: 'var(--ggh-text)' }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAccountClick?.();
                    }}
                  >
                    {t(lang, 'account')}
                  </button>
                </>
              ) : (
                <button
                  className="text-base font-medium py-3 px-4 rounded-lg hover:bg-gray-50 min-h-[48px] flex items-center w-full text-start"
                  style={{ color: 'var(--ggh-primary)' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onAccountClick?.();
                  }}
                >
                  {t(lang, 'login')}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
