'use client';

import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { useLangStore } from '@/stores/lang-store';
import { t } from '@/lib/ggh/i18n';

export default function Footer() {
  const { lang, isRTL } = useLangStore();

  const quickLinks = [
    { href: '#', label: t(lang, 'aboutUs') },
    { href: '#', label: t(lang, 'deliveryPolicy') },
    { href: '#', label: t(lang, 'refundPolicy') },
    { href: '#', label: t(lang, 'contactUs') },
  ];

  return (
    <footer
      id="footer"
      className="py-10 sm:py-12 px-4 mt-auto"
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
              {t(lang, 'slogan')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-green-200 hover:text-white transition-colors min-h-[32px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {t(lang, 'contactUs')}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="tel:+201000000000"
                className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors min-h-[32px]"
              >
                <Phone className="size-3.5" />
                <span dir="ltr">+20 100 000 0000</span>
              </a>
              <a
                href="mailto:info@ggh.com"
                className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors min-h-[32px]"
              >
                <Mail className="size-3.5" />
                <span>info@ggh.com</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {t(lang, 'followUs')}
            </h3>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon className="size-5 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }} />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-green-200">
            © 2025 GGH Gomla Go Home. {t(lang, 'allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
