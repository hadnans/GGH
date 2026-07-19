'use client';

import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface CartItem {
  id: string;
  nameEn: string;
  nameAr: string;
  brandEn: string;
  brandAr: string;
  price: number;
  qty: number;
  icon: string;
}

interface CartSlideOutProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartSlideOut({
  lang,
  t,
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
}: CartSlideOutProps) {
  const isRTL = lang === 'ar';
  const side = isRTL ? 'left' : 'right';

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side={side}
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--ggh-text)' }}>
            <ShoppingCart className="size-6" style={{ color: 'var(--ggh-primary)' }} />
            {t.yourCart}
            {totalItems > 0 && (
              <span
                className="text-base font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--ggh-card)', color: 'var(--ggh-text-secondary)' }}
              >
                {totalItems} {t.items}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* Cart items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingCart className="size-16 mb-4" style={{ color: '#D0D0D0' }} />
            <p className="text-xl font-semibold" style={{ color: 'var(--ggh-text-secondary)' }}>
              {t.emptyCart}
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: 'var(--ggh-card)' }}
                >
                  {/* Item icon */}
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-xl shrink-0"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <span className="text-3xl">{item.icon}</span>
                  </div>

                  {/* Item details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold truncate" style={{ color: 'var(--ggh-text)' }}>
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--ggh-text-secondary)' }}>
                      {lang === 'ar' ? item.brandAr : item.brandEn}
                    </p>

                    {/* Quantity controls + price */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-lg"
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="w-8 text-center text-lg font-bold" style={{ color: 'var(--ggh-text)' }}>
                          {item.qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-lg"
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <span
                        className="text-lg font-extrabold"
                        style={{ color: 'var(--ggh-primary)' }}
                      >
                        {(item.price * item.qty).toFixed(1)} {t.egp}
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 self-start"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer with summary */}
        {items.length > 0 && (
          <SheetFooter className="p-4 pt-2">
            <div className="w-full space-y-3">
              <Separator />
              {/* Subtotal */}
              <div className="flex justify-between text-lg">
                <span style={{ color: 'var(--ggh-text-secondary)' }}>{t.subtotal}</span>
                <span className="font-bold" style={{ color: 'var(--ggh-text)' }}>
                  {subtotal.toFixed(1)} {t.egp}
                </span>
              </div>
              {/* Delivery fee */}
              <div className="flex justify-between text-lg">
                <span style={{ color: 'var(--ggh-text-secondary)' }}>{t.deliveryFee}</span>
                <span className="font-bold" style={{ color: 'var(--ggh-primary)' }}>
                  {t.free}
                </span>
              </div>
              <Separator />
              {/* Total */}
              <div className="flex justify-between text-xl">
                <span className="font-bold" style={{ color: 'var(--ggh-text)' }}>{t.total}</span>
                <span className="font-extrabold" style={{ color: 'var(--ggh-primary)' }}>
                  {subtotal.toFixed(1)} {t.egp}
                </span>
              </div>

              {/* Checkout button */}
              <Button
                className="w-full h-14 text-xl font-bold rounded-xl mt-2"
                style={{ backgroundColor: 'var(--ggh-primary)', color: '#FFFFFF' }}
              >
                {t.proceedToCheckout}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
