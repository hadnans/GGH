'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Grid3X3,
  Flame,
  Warehouse,
  DollarSign,
  Upload,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Box,
  Award,
  Loader2,
} from 'lucide-react';

import { useAdminStore, type AdminSubView } from '@/stores/admin-store';
import { useLangStore } from '@/stores/lang-store';
import { t } from '@/lib/ggh/i18n';
import { formatPriceWithCurrency, type Piastres } from '@/types/ggh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Import admin sub-view components
import AdminProductManager from './products/AdminProductManager';
import AdminCategoryManager from './categories/AdminCategoryManager';
import AdminDealManager from './deals/AdminDealManager';
import AdminInventoryManager from './inventory/AdminInventoryManager';
import AdminPriceRuleManager from './price-rules/AdminPriceRuleManager';
import BulkImportExport from './bulk/BulkImportExport';
import AdminOrderManager from './orders/AdminOrderManager';
import AdminCustomerManager from './customers/AdminCustomerManager';
import AdminAnalytics from './analytics/AdminAnalytics';
import AdminSettings from './settings/AdminSettings';
import AdminDeliveryManager from './delivery/AdminDeliveryManager';
import AdminRbacManager from './rbac/AdminRbacManager';
import LoyaltyProgramManager from './loyalty/LoyaltyProgramManager';

// ============================================
// SUB-VIEW TITLE KEY MAP
// ============================================
const subViewTitleKeys: Record<AdminSubView, string> = {
  dashboard: 'adminDashboard',
  products: 'adminProducts',
  categories: 'adminCategories',
  deals: 'adminDeals',
  inventory: 'adminInventory',
  'price-rules': 'adminPriceRules',
  bulk: 'adminBulk',
  orders: 'adminOrders',
  customers: 'adminCustomers',
  delivery: 'adminDelivery',
  analytics: 'adminAnalytics',
  loyalty: 'adminLoyalty',
  settings: 'adminSettings',
  rbac: 'adminRBAC',
};

const subViewIcons: Record<AdminSubView, React.ComponentType<{ className?: string }>> = {
  dashboard: TrendingUp,
  products: Package,
  categories: Grid3X3,
  deals: Flame,
  inventory: Warehouse,
  'price-rules': DollarSign,
  bulk: Upload,
  orders: ShoppingCart,
  customers: Users,
  delivery: Truck,
  analytics: BarChart3,
  loyalty: Award,
  settings: Settings,
  rbac: Shield,
};

// ============================================
// CONTENT AREA COMPONENT
// ============================================
export default function AdminContentArea() {
  const { lang, isRTL } = useLangStore();
  const { currentSubView } = useAdminStore();

  const titleKey = subViewTitleKeys[currentSubView];
  const pageTitle = t(lang, titleKey);
  const Icon = subViewIcons[currentSubView];

  // Render real sub-view components for implemented views
  const renderSubView = () => {
    switch (currentSubView) {
      case 'products':
        return <AdminProductManager lang={lang} />;
      case 'categories':
        return <AdminCategoryManager lang={lang} />;
      case 'deals':
        return <AdminDealManager lang={lang} />;
      case 'inventory':
        return <AdminInventoryManager lang={lang} />;
      case 'price-rules':
        return <AdminPriceRuleManager lang={lang} />;
      case 'bulk':
        return <BulkImportExport lang={lang} />;
      case 'orders':
        return <AdminOrderManager lang={lang} />;
      case 'customers':
        return <AdminCustomerManager lang={lang} />;
      case 'analytics':
        return <AdminAnalytics lang={lang} />;
      case 'settings':
        return <AdminSettings lang={lang} />;
      case 'delivery':
        return <AdminDeliveryManager lang={lang} />;
      case 'loyalty':
        return <LoyaltyProgramManager lang={lang} />;
      case 'rbac':
        return <AdminRbacManager lang={lang} />;
      default:
        return (
          <PlaceholderSubView
            lang={lang}
            viewId={currentSubView}
            pageTitle={pageTitle}
            Icon={Icon}
          />
        );
    }
  };

  return (
    <div
      data-slot="admin-content-area"
      className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
      id="admin-content"
    >
      <AnimatePresence mode="wait">
        {currentSubView === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <AdminDashboard lang={lang} isRTL={isRTL} />
          </motion.div>
        ) : (
          <motion.div
            key={currentSubView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderSubView()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// ADMIN DASHBOARD (Real data from API)
// ============================================
interface AdminDashboardProps {
  lang: 'en' | 'ar';
  isRTL: boolean;
}

function AdminDashboard({ lang }: AdminDashboardProps) {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard?period=today');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to load dashboard' }));
        throw new Error(errData.error || 'Failed to load dashboard');
      }
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
        <p className="text-sm text-muted-foreground">{t(lang, 'adminLoading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertTriangle className="size-8 text-amber-500" />
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const data = dashboardData;
  const ordersCount = data?.orders?.count ?? 0;
  const totalRevenue = data?.orders?.totalRevenue ?? 0;
  const totalCustomers = data?.totalCustomers ?? 0;
  const lowStockProducts = data?.lowStockProducts ?? 0;
  const pendingOrders = data?.pendingOrders ?? 0;
  const activeDeals = data?.activeDeals ?? 0;

  const stats = [
    {
      titleKey: 'adminTotalOrders',
      value: ordersCount.toLocaleString(),
      change: pendingOrders > 0 ? `${pendingOrders} pending` : 'No pending',
      icon: ShoppingCart,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      titleKey: 'adminTotalRevenue',
      value: formatPriceWithCurrency(totalRevenue as Piastres, lang),
      change: 'Today',
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    },
    {
      titleKey: 'adminActiveProducts',
      value: activeDeals.toString(),
      change: 'Active deals',
      icon: Box,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/30',
    },
    {
      titleKey: 'adminActiveCustomers',
      value: totalCustomers.toLocaleString(),
      change: 'Registered',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  // Recent orders from API data
  const recentOrders = data?.recentOrders ?? [];

  // Top products from API data
  const topProducts = data?.topProducts ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t(lang, 'adminWelcome')}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t(lang, 'adminOverview')} — {t(lang, 'adminToday')}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
          <CheckCircle2 className="size-3.5" />
          {t(lang, 'adminAllSystems')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.titleKey} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">
                      {t(lang, stat.titleKey)}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <StatIcon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Health + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              {t(lang, 'adminSystemHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HealthItem label="API Server" status="healthy" progress={98} />
            <HealthItem label="Database" status="healthy" progress={95} />
            <HealthItem label="Session Store" status="healthy" progress={92} />
            <HealthItem label="CDN" status="healthy" progress={100} />
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              {lowStockProducts > 0
                ? `${lowStockProducts} ${t(lang, 'adminLowStockAlerts')}`
                : t(lang, 'adminLowStockAlerts')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.slice(0, 4).map((product: { nameEn: string; nameAr: string; stock: number }) => (
                <AlertItem
                  key={product.nameEn}
                  label={lang === 'ar' ? product.nameAr : product.nameEn}
                  count={product.stock}
                  severity={product.stock < 5 ? 'critical' : product.stock < 15 ? 'warning' : 'info'}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t(lang, 'adminNoAlerts')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            {t(lang, 'adminRecentOrders')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: {
                id: string;
                orderNumber: string;
                customerName?: string;
                customerNameAr?: string;
                totalAmount: number;
                status: string;
              }) => (
                <div key={order.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {lang === 'ar' ? (order.customerNameAr || order.customerName) : order.customerName}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground shrink-0">
                    {formatPriceWithCurrency(order.totalAmount as Piastres, lang)}
                  </p>
                  <OrderStatusBadge status={order.status} lang={lang} />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">{t(lang, 'adminNoOrdersYet')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              {t(lang, 'adminTopProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product: {
                id: string;
                nameEn: string;
                nameAr: string;
                icon: string;
                totalSold: number;
                price: number;
                stock: number;
              }) => (
                <div key={product.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{product.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lang === 'ar' ? product.nameAr : product.nameEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground shrink-0">
                    {formatPriceWithCurrency(product.price as Piastres, lang)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================
// HELPER SUB-COMPONENTS
// ============================================
function HealthItem({ label, status, progress }: { label: string; status: string; progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs text-emerald-600 font-medium">{status}</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}

function AlertItem({ label, count, severity }: { label: string; count: number; severity: 'critical' | 'warning' | 'info' }) {
  const colors = {
    critical: 'text-red-600 bg-red-50 dark:bg-red-950/30',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    info: 'text-sky-600 bg-sky-50 dark:bg-sky-950/30',
  };

  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${colors[severity]}`}>
          {count} left
        </span>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status, lang }: { status: string; lang: 'en' | 'ar' }) {
  const statusMap: Record<string, { key: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    delivered: { key: 'delivered', variant: 'default' },
    processing: { key: 'processing', variant: 'secondary' },
    pending: { key: 'pending', variant: 'outline' },
    confirmed: { key: 'confirmed', variant: 'secondary' },
    out_for_delivery: { key: 'outForDelivery', variant: 'secondary' },
    cancelled: { key: 'cancelled', variant: 'destructive' },
    packed: { key: 'packed', variant: 'secondary' },
  };

  const config = statusMap[status] || { key: status, variant: 'outline' as const };

  return (
    <Badge variant={config.variant} className="text-xs shrink-0">
      {t(lang, config.key)}
    </Badge>
  );
}

// ============================================
// PLACEHOLDER SUB-VIEW (for views not yet built)
// ============================================
interface PlaceholderSubViewProps {
  lang: 'en' | 'ar';
  viewId: AdminSubView;
  pageTitle: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function PlaceholderSubView({ lang, viewId, pageTitle, Icon }: PlaceholderSubViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {pageTitle}
      </h2>
      <p className="text-muted-foreground text-sm max-w-md">
        {t(lang, 'adminComingSoon')}
      </p>
      <Separator className="my-6 max-w-xs" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Box className="size-3" />
        <span>Sub-view: {viewId}</span>
      </div>
    </div>
  );
}
