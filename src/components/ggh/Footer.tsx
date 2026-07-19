'use client';

import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
}

export default function Footer({ lang, t }: FooterProps) {
  const isRTL = lang === 'ar';

  return (
    <footer
      id="footer"
      className="py-10 sm:py-12 px-4"
      style={{ backgroundColor: '#1B5E20' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top section: Brand + Links + Contact in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-white">GGH</span>
              <span className="text-sm font-medium text-green-200">
                {isRTL ? 'جملة لحد البيت' : 'Gomla Go Home'}
              </span>
            </div>
            <p className="text-sm text-green-200 leading-relaxed max-w-xs">
              {t.slogan}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-green-200 hover:text-white transition-colors"
              >
                {t.aboutUs}
              </a>
              <a
                href="#"
                className="text-sm text-green-200 hover:text-white transition-colors"
              >
                {t.deliveryPolicy}
              </a>
              <a
                href="#"
                className="text-sm text-green-200 hover:text-white transition-colors"
              >
                {t.refundPolicy}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {t.contactUs}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+201000000000"
                className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors"
              >
                <Phone className="size-3.5" />
                <span>+20 100 000 0000</span>
              </a>
              <a
                href="mailto:info@ggh.com"
                className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors"
              >
                <Mail className="size-3.5" />
                <span>info@ggh.com</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {t.followUs}
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Facebook className="size-4 text-white" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Instagram className="size-4 text-white" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Twitter className="size-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }} />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-green-200">
            © 2025 GGH Gomla Go Home. {t.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
