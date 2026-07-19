'use client';

import { categories } from '@/lib/ggh/data';

interface CategoryGridProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
}

export default function CategoryGrid({ lang, t }: CategoryGridProps) {
  return (
    <section id="categories" className="py-8 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--ggh-text)' }}>
          {t.categories}
        </h2>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: cat.color, minHeight: '120px' }}
              aria-label={lang === 'ar' ? cat.nameAr : cat.nameEn}
            >
              {/* Emoji icon */}
              <span className="text-5xl sm:text-6xl mb-2" aria-hidden="true">
                {cat.icon}
              </span>
              {/* Category name */}
              <span
                className="text-lg sm:text-xl font-semibold text-center leading-tight"
                style={{ color: 'var(--ggh-text)' }}
              >
                {lang === 'ar' ? cat.nameAr : cat.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
