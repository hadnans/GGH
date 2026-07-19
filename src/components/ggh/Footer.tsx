'use client';

import { Phone, Mail } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ar';
  t: Record<string, string>;
}

export default function Footer({ lang, t }: FooterProps) {
  return (
    <footer
      id="footer"
      className="py-8 sm:py-10 px-4"
      style={{ backgroundColor: 'var(--ggh-primary)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top section: links + social */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <a
              href="#"
              className="text-lg font-medium text-white hover:text-green-200 transition-colors"
            >
              {t.aboutUs}
            </a>
            <a
              href="#"
              className="text-lg font-medium text-white hover:text-green-200 transition-colors"
            >
              {t.deliveryPolicy}
            </a>
            <a
              href="#"
              className="text-lg font-medium text-white hover:text-green-200 transition-colors"
            >
              {t.refundPolicy}
            </a>
            <a
              href="#"
              className="text-lg font-medium text-white hover:text-green-200 transition-colors"
            >
              {t.contactUs}
            </a>
          </div>

          {/* Social + Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-lg font-semibold text-white">{t.followUs}</span>
            <div className="flex gap-4 text-2xl">
              <a href="#" aria-label="Facebook" className="hover:scale-110 transition-transform">
                📘
              </a>
              <a href="#" aria-label="Instagram" className="hover:scale-110 transition-transform">
                📸
              </a>
              <a href="#" aria-label="Twitter" className="hover:scale-110 transition-transform">
                🐦
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:scale-110 transition-transform">
                💬
              </a>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <a
                href="tel:+201000000000"
                className="flex items-center gap-2 text-white hover:text-green-200 transition-colors"
              >
                <Phone className="size-4" />
                <span className="text-base">+20 100 000 0000</span>
              </a>
              <a
                href="mailto:info@ggh.com"
                className="flex items-center gap-2 text-white hover:text-green-200 transition-colors"
              >
                <Mail className="size-4" />
                <span className="text-base">info@ggh.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-green-600" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-base text-green-100">
            © 2025 GGH Gomla Go Home. {t.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
