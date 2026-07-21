'use client';

import { Package } from 'lucide-react';
import { type Lang, type Order } from '@/types/ggh';
import { t } from '@/lib/ggh/i18n';
import OrderCard from '@/features/order/components/OrderCard';

interface OrdersViewProps {
  lang: Lang;
  orders: Order[];
}

export default function OrdersView({ lang, orders }: OrdersViewProps) {
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
