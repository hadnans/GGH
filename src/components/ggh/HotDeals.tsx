'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { deals } from '@/lib/ggh/data';

interface HotDealsProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
}

function CountdownTimer({ lang, t }: { lang: 'en' | 'ar'; t: Record<string, string> }) {
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--ggh-accent)' }}>
      <Clock className="size-4" />
      <span>{t.dealEndsIn}</span>
      <span className="font-mono">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function HotDeals({ lang, t }: HotDealsProps) {
  return (
    <section id="deals" className="py-8 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--ggh-text)' }}>
          {t.hotDeals}
        </h2>

        {/* Countdown */}
        <div className="mb-4">
          <CountdownTimer lang={lang} t={t} />
        </div>

        {/* Horizontal scrollable deals */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="min-w-[260px] sm:min-w-[280px] snap-start shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}
            >
              {/* Product icon area */}
              <div
                className="flex items-center justify-center py-6"
                style={{ backgroundColor: deal.bgColor }}
              >
                <span className="text-6xl" role="img" aria-label={deal.productEn}>
                  {deal.icon}
                </span>
              </div>

              {/* Deal info */}
              <div className="p-4">
                {/* Product name */}
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ggh-text)' }}>
                  {lang === 'ar' ? deal.productAr : deal.productEn}
                </h3>

                {/* Discount badge */}
                <Badge
                  className="text-base font-bold px-3 py-1 mb-2"
                  style={{ backgroundColor: 'var(--ggh-accent)', color: '#FFFFFF' }}
                >
                  -{deal.discount}% {t.off}
                </Badge>

                {/* Prices */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--ggh-accent)' }}
                  >
                    {deal.dealPrice} {t.egp}
                  </span>
                  <span
                    className="text-lg line-through"
                    style={{ color: 'var(--ggh-text-secondary)' }}
                  >
                    {deal.originalPrice} {t.egp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
