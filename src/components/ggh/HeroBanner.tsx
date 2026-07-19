'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroBannerProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
}

export default function HeroBanner({ lang, t }: HeroBannerProps) {
  const isRTL = lang === 'ar';

  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 px-4"
      style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 50%, #2E7D32 100%)',
      }}
    >
      {/* Decorative floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute text-4xl opacity-20 top-[10%] left-[5%] animate-bounce" style={{ animationDuration: '3s' }}>🍚</span>
        <span className="absolute text-3xl opacity-15 top-[20%] right-[10%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🫒</span>
        <span className="absolute text-4xl opacity-20 bottom-[15%] left-[15%] animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🍝</span>
        <span className="absolute text-3xl opacity-15 bottom-[25%] right-[5%] animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🥫</span>
        <span className="absolute text-5xl opacity-10 top-[50%] left-[50%] animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>🍬</span>
        <span className="absolute text-3xl opacity-15 top-[60%] right-[20%] animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>🍵</span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6 whitespace-pre-line">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-green-100 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* CTA Button */}
        <Button
          className="h-14 sm:h-16 px-8 sm:px-12 text-xl sm:text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--ggh-accent)', color: '#FFFFFF' }}
          size="lg"
        >
          {t.shopNow}
          {isRTL ? (
            <ChevronLeft className="size-6 ms-2" />
          ) : (
            <ChevronRight className="size-6 ms-2" />
          )}
        </Button>
      </div>
    </section>
  );
}
