'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, User, Package, ChevronDown, Flame, Sparkles, Search as SearchIcon, X } from 'lucide-react';

// Stores
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useLangStore } from '@/stores/lang-store';

// i18n
import { t } from '@/lib/ggh/i18n';

// Types
import { type Lang, type Piastres, type Product, type Category, type Deal, type Order, type Address, type AuthResponse, formatPriceWithCurrency, calcDiscountPercent } from '@/types/ggh';

// API
import { api } from '@/services/api';

// Feature Components
import Header from '@/components/ggh/Header';
import Footer from '@/components/ggh/Footer';
import MobileNav from '@/components/ggh/MobileNav';
import ProductCard from '@/features/product/components/ProductCard';
import DealCard from '@/features/product/components/DealCard';
import CartSlideOut from '@/features/cart/components/CartSlideOut';
import LoginForm from '@/features/auth/components/LoginForm';
import CheckoutFlow from '@/features/checkout/components/CheckoutFlow';
import OrderCard from '@/features/order/components/OrderCard';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================
// VIEWS
// ============================================
type AppView = 'shop' | 'checkout' | 'orders' | 'account';

export default function Home() {
  const { lang, isRTL, toggleLang } = useLangStore();
  const { isAuthenticated, customer, login: authLogin, logout: authLogout } = useAuthStore();
  const { openCart, getItemCount } = useCartStore();

  const [currentView, setCurrentView] = useState<AppView>('shop');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [seedComplete, setSeedComplete] = useState(false);

  const queryClient = useQueryClient();
  const seededRef = useRef(false);

  // ============================================
  // SEED DATABASE ON FIRST LOAD
  // ============================================
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    fetch('/api/seed', { method: 'POST' })
      .then((res) => res.json())
      .then(() => setSeedComplete(true))
      .catch(() => setSeedComplete(true));
  }, []);

  // ============================================
  // FETCH DATA
  // ============================================
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const json = await res.json();
      return json.data as Category[];
    },
    enabled: seedComplete,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products?limit=50');
      const json = await res.json();
      return json.data as Product[];
    },
    enabled: seedComplete,
  });

  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const res = await fetch('/api/deals');
      const json = await res.json();
      return json.data as (Deal & { product: Product })[];
    },
    enabled: seedComplete,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []) as Order[];
    },
    enabled: isAuthenticated && currentView === 'orders',
  });

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await fetch('/api/addresses');
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []) as Address[];
    },
    enabled: isAuthenticated,
  });

  const categories = categoriesData || [];
  const products = productsData || [];
  const deals = dealsData || [];
  const orders = ordersData || [];
  const addresses = addressesData || [];

  // Group products by category
  const productsByCategory = categories
    .map((cat) => ({
      category: cat,
      products: products.filter((p) => p.categoryId === cat.id),
    }))
    .filter((group) => group.products.length > 0);

  // Featured products
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  // ============================================
  // SEARCH
  // ============================================
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { products: [], categories: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}`);
      const json = await res.json();
      return json.data as { products: Product[]; categories: Category[] };
    },
    enabled: searchQuery.length >= 2,
  });

  // ============================================
  // AUTH HANDLERS
  // ============================================
  const handleLoginSuccess = useCallback((response: AuthResponse) => {
    authLogin(response.customer, response.token);
    setShowLoginDialog(false);
  }, [authLogin]);

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    authLogout();
    setCurrentView('shop');
  }, [authLogout]);

  // ============================================
  // CHECKOUT HANDLERS
  // ============================================
  const handleCheckoutComplete = useCallback((order: Order) => {
    setCurrentView('shop');
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    useCartStore.getState().clearCart();
  }, [queryClient]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--ggh-bg)' }}>
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
        {t(lang, 'skipToContent')}
      </a>

      {/* Header */}
      <Header
        lang={lang}
        onToggleLang={toggleLang}
        cartCount={getItemCount()}
        onOpenCart={openCart}
        onSearchClick={() => setShowSearchOverlay(true)}
        onAccountClick={() => {
          if (isAuthenticated) {
            setCurrentView(currentView === 'account' ? 'shop' : 'account');
          } else {
            setShowLoginDialog(true);
          }
        }}
        onOrdersClick={() => {
          if (isAuthenticated) {
            setCurrentView('orders');
          } else {
            setShowLoginDialog(true);
          }
        }}
        isAuthenticated={isAuthenticated}
        customerName={customer?.firstName || ''}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShopView
                lang={lang}
                categories={categories}
                products={products}
                deals={deals}
                productsByCategory={productsByCategory}
                featuredProducts={featuredProducts}
                isLoading={categoriesLoading || productsLoading}
                onCategoryClick={(slug) => {
                  const el = document.getElementById(`section-${slug}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {currentView === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-4 py-6"
            >
              <CheckoutFlow
                addresses={addresses}
                deliverySlots={[]}
                lang={lang}
                onComplete={handleCheckoutComplete}
              />
            </motion.div>
          )}

          {currentView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-4 py-6"
            >
              <OrdersView lang={lang} orders={orders} />
            </motion.div>
          )}

          {currentView === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-4 py-6"
            >
              <AccountView lang={lang} customer={customer} onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer lang={lang} />
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav
        lang={lang}
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'cart') {
            openCart();
          } else if (view === 'account' && !isAuthenticated) {
            setShowLoginDialog(true);
          } else if (view === 'orders' && !isAuthenticated) {
            setShowLoginDialog(true);
          } else {
            setCurrentView(view as AppView);
          }
        }}
        cartCount={getItemCount()}
      />

      {/* Cart Slide Out */}
      <CartSlideOut lang={lang} onCheckout={() => setCurrentView('checkout')} />

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center" style={{ color: 'var(--ggh-text)' }}>
              {t(lang, 'welcomeBack')}
            </DialogTitle>
          </DialogHeader>
          <LoginForm
            onSuccess={handleLoginSuccess}
            lang={lang}
          />
        </DialogContent>
      </Dialog>

      {/* Search Overlay */}
      <Dialog open={showSearchOverlay} onOpenChange={setShowSearchOverlay}>
        <DialogContent className="sm:max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="sr-only">{t(lang, 'search')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute top-1/2 -translate-y-1/2 size-5" style={{ color: 'var(--ggh-text-secondary)', [isRTL ? 'right' : 'left']: '14px' }} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(lang, 'search')}
                className="h-14 text-lg rounded-xl"
                style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '44px' }}
                autoFocus
                dir="ltr"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -translate-y-1/2 h-8 w-8"
                  style={{ [isRTL ? 'left' : 'right']: '8px' }}
                  onClick={() => setSearchQuery('')}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            {searchLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            )}

            {searchResults && searchQuery.length >= 2 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.categories && searchResults.categories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--ggh-text-secondary)' }}>
                      {t(lang, 'categories')}
                    </p>
                    {searchResults.categories.map((cat) => (
                      <button
                        key={cat.id}
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-start"
                        onClick={() => {
                          setShowSearchOverlay(false);
                          const el = document.getElementById(`section-${cat.slug}`);
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-medium" style={{ color: 'var(--ggh-text)' }}>
                          {lang === 'ar' ? cat.nameAr : cat.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.products && searchResults.products.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--ggh-text-secondary)' }}>
                      {t(lang, 'popularProducts')}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {searchResults.products.slice(0, 6).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                        >
                          <span className="text-2xl">{product.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate" style={{ color: 'var(--ggh-text)' }}>
                              {lang === 'ar' ? product.nameAr : product.nameEn}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--ggh-primary)' }}>
                              {formatPriceWithCurrency(product.todayPrice, lang)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!searchResults.products || searchResults.products.length === 0) &&
                  (!searchResults.categories || searchResults.categories.length === 0) && (
                  <div className="text-center py-8">
                    <p style={{ color: 'var(--ggh-text-secondary)' }}>
                      {t(lang, 'noResults')}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--ggh-text-secondary)' }}>
                      {t(lang, 'searchHint')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-4">
                <p className="text-sm" style={{ color: 'var(--ggh-text-secondary)' }}>
                  {t(lang, 'searchHint')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// SHOP VIEW
// ============================================

function ShopView({
  lang,
  categories,
  products,
  deals,
  productsByCategory,
  featuredProducts,
  isLoading,
  onCategoryClick,
}: {
  lang: Lang;
  categories: Category[];
  products: Product[];
  deals: (Deal & { product: Product })[];
  productsByCategory: { category: Category; products: Product[] }[];
  featuredProducts: Product[];
  isLoading: boolean;
  onCategoryClick: (slug: string) => void;
}) {
  return (
    <div>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #1B6820 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight whitespace-pre-line"
            >
              {t(lang, 'heroTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-base sm:text-lg text-green-100 max-w-2xl mx-auto"
            >
              {t(lang, 'heroSubtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Button
                className="h-14 px-8 text-lg font-bold rounded-2xl shadow-lg"
                style={{ backgroundColor: '#FF6D00', color: '#FFFFFF' }}
                onClick={() => {
                  document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ShoppingBag className="size-5 me-2" />
                {t(lang, 'shopNow')}
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -end-20 size-64 rounded-full opacity-10" style={{ backgroundColor: '#FF6D00' }} />
        <div className="absolute -bottom-16 -start-16 size-48 rounded-full opacity-10" style={{ backgroundColor: '#FFFFFF' }} />
      </section>

      {/* Categories Grid */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ggh-text)' }}>
            {t(lang, 'exploreCategories')}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onCategoryClick(cat.slug)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:shadow-md active:scale-95 min-h-[96px]"
                style={{ backgroundColor: cat.color || '#F5F5F5' }}
                aria-label={lang === 'ar' ? cat.nameAr : cat.nameEn}
              >
                <span className="text-3xl sm:text-4xl" role="img">{cat.icon}</span>
                <span className="text-sm font-semibold text-center leading-tight" style={{ color: 'var(--ggh-text)' }}>
                  {lang === 'ar' ? cat.nameAr : cat.nameEn}
                </span>
                {cat.productCount !== undefined && (
                  <span className="text-xs" style={{ color: 'var(--ggh-text-secondary)' }}>
                    {cat.productCount} {t(lang, 'items')}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* Hot Deals Section */}
      {deals.length > 0 && (
        <section className="py-8" style={{ backgroundColor: '#FFF8F0' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="size-7" style={{ color: '#FF6D00' }} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ggh-text)' }}>
                {t(lang, 'hotDeals')}
              </h2>
              <Badge className="text-xs font-bold px-2.5 py-1 border-0" style={{ backgroundColor: '#FF6D00', color: '#FFFFFF' }}>
                {deals.length} {lang === 'ar' ? 'عرض' : 'deals'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {deals.slice(0, 8).map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="size-6" style={{ color: 'var(--ggh-primary)' }} />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--ggh-text)' }}>
              {t(lang, 'bestSellers')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Product Sections by Category */}
      {productsByCategory.map((group) => (
        <section
          key={group.category.id}
          id={`section-${group.category.slug}`}
          className="max-w-7xl mx-auto px-4 py-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{group.category.icon}</span>
            <h2 className="text-xl font-bold" style={{ color: 'var(--ggh-text)' }}>
              {lang === 'ar' ? group.category.nameAr : group.category.nameEn}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {group.products.length}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        </section>
      ))}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 sm:h-0" />
    </div>
  );
}

// ============================================
// ORDERS VIEW
// ============================================

function OrdersView({ lang, orders }: { lang: Lang; orders: Order[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Package className="size-6" style={{ color: 'var(--ggh-primary)' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--ggh-text)' }}>
          {t(lang, 'myOrders')}
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="size-16 mx-auto mb-4" style={{ color: '#E0E0E0' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--ggh-text-secondary)' }}>
            {t(lang, 'noOrders')}
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--ggh-text-secondary)' }}>
            {t(lang, 'searchHint')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ACCOUNT VIEW
// ============================================

function AccountView({
  lang,
  customer,
  onLogout,
}: {
  lang: Lang;
  customer: { firstName: string; lastName: string; phone: string; nameAr: string; preferredLang: string; wholesaleStatus: string } | null;
  onLogout: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="size-6" style={{ color: 'var(--ggh-primary)' }} />
        <h2 className="text-2xl font-bold" style={{ color: 'var(--ggh-text)' }}>
          {t(lang, 'account')}
        </h2>
      </div>

      {/* Profile Card */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: 'var(--ggh-card)', border: '1px solid var(--ggh-border)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="size-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: 'var(--ggh-primary)' }}
          >
            {customer?.firstName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--ggh-text)' }}>
              {customer?.nameAr && lang === 'ar'
                ? customer.nameAr
                : `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || t(lang, 'account')}
            </h3>
            <p className="text-sm" style={{ color: 'var(--ggh-text-secondary)' }}>
              {customer?.phone}
            </p>
            {customer?.wholesaleStatus && customer.wholesaleStatus !== 'retail' && (
              <Badge className="mt-1" style={{ backgroundColor: '#E8F5E9', color: 'var(--ggh-primary)' }}>
                {customer.wholesaleStatus === 'wholesale'
                  ? lang === 'ar' ? 'جملة' : 'Wholesale'
                  : customer.wholesaleStatus === 'vip'
                  ? lang === 'ar' ? 'VIP' : 'VIP'
                  : customer.wholesaleStatus}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Account Menu */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-14 text-base rounded-xl"
          style={{ color: 'var(--ggh-text)' }}
        >
          <Package className="size-5 me-3" style={{ color: 'var(--ggh-primary)' }} />
          {t(lang, 'orders')}
        </Button>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full h-14 text-base font-medium rounded-xl"
        style={{ borderColor: 'var(--ggh-border)', color: '#CF222E' }}
        onClick={onLogout}
      >
        {t(lang, 'logout')}
      </Button>
    </div>
  );
}
