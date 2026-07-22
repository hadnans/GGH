// GGH — Admin Login Page
// Professional, modern, app-like admin authentication screen
// Supports EN/AR bilingual, RTL, responsive, animated

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Globe, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { t } from '@/lib/ggh/i18n';
import { type AdminUser, type Lang } from '@/types/ggh';
import { useAdminSessionStore } from '@/stores/admin-session-store';

interface AdminLoginPageProps {
  lang: Lang;
  onToggleLang: () => void;
  onLoginSuccess: () => void;
}

export function AdminLoginPage({ lang, onToggleLang, onLoginSuccess }: AdminLoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAdminSessionStore();

  const isAr = lang === 'ar';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم' : 'Please enter your email or username');
      return;
    }
    if (!password.trim()) {
      setError(isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMsg = result.error || result.message || (isAr ? 'فشل تسجيل الدخول' : 'Login failed');
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      // Map backend response to AdminUser type
      const user: AdminUser = {
        id: result.data.user.id,
        email: result.data.user.email,
        nameEn: result.data.user.nameEn,
        nameAr: result.data.user.nameAr,
        phone: result.data.user.phone,
        isActive: result.data.user.isActive,
        lastLoginAt: null,
        customerId: result.data.user.customerId,
        roles: result.data.user.roleNames || [],
        createdAt: '',
      };

      login(user);
      setIsLoading(false);
      onLoginSuccess();
    } catch {
      setError(isAr ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
      setIsLoading(false);
    }
  }, [identifier, password, isAr, login, onLoginSuccess]);

  // Translation keys for the login page
  const translations = {
    title: t(lang, 'adminPortal'),
    subtitle: isAr ? 'تسجيل الدخول إلى لوحة الإدارة' : 'Sign in to Admin Portal',
    emailLabel: isAr ? 'البريد الإلكتروني / اسم المستخدم' : 'Email / Username',
    emailPlaceholder: isAr ? 'أدخل البريد الإلكتروني أو اسم المستخدم' : 'Enter email or username',
    passwordLabel: isAr ? 'كلمة المرور' : 'Password',
    passwordPlaceholder: isAr ? 'أدخل كلمة المرور' : 'Enter password',
    signIn: isAr ? 'تسجيل الدخول' : 'Sign In',
    rememberMe: isAr ? 'تذكرني' : 'Remember me',
    forgotPassword: isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    brandName: t(lang, 'brandName'),
    brandSubtext: isAr ? 'جملة لحد البيت' : 'Gomla Go Home',
    secureNote: isAr ? 'اتصال آمن ومشفر' : 'Secure & encrypted connection',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-950 dark:via-gray-950 dark:to-emerald-950" />

      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating decorative circles */}
      <motion.div
        className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Main login card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-0 shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          {/* Brand Header */}
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Logo icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>

              {/* Brand name */}
              <div className="flex flex-col items-center gap-0.5">
                <CardTitle className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {translations.brandName}
                </CardTitle>
                <span className="text-sm font-medium text-emerald-600/80 dark:text-emerald-500/80">
                  {translations.brandSubtext}
                </span>
              </div>

              <CardDescription className="text-sm text-muted-foreground mt-1">
                {translations.subtitle}
              </CardDescription>
            </motion.div>

            {/* Language toggle */}
            <motion.div
              className="flex justify-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleLang}
                className="gap-2 text-xs font-medium border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors rounded-full px-4"
              >
                <Globe className="w-3.5 h-3.5" />
                {isAr ? 'English' : 'العربية'}
              </Button>
            </motion.div>
          </CardHeader>

          {/* Login Form */}
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-2"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-400"
                    >
                      !
                    </motion.span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email/Username field */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Label htmlFor="admin-identifier" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 inline-block mr-1.5 ml-1.5" />
                  {translations.emailLabel}
                </Label>
                <Input
                  id="admin-identifier"
                  type="text"
                  placeholder={translations.emailPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  disabled={isLoading}
                  className="h-11 text-base rounded-lg border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/30 transition-all bg-white dark:bg-gray-800"
                />
              </motion.div>

              {/* Password field */}
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Label htmlFor="admin-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Lock className="w-4 h-4 inline-block mr-1.5 ml-1.5" />
                  {translations.passwordLabel}
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={translations.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-11 text-base rounded-lg border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/30 transition-all bg-white dark:bg-gray-800 pr-11 pl-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none disabled:opacity-50"
                    disabled={isLoading}
                    aria-label={showPassword
                      ? (isAr ? 'إخفاء كلمة المرور' : 'Hide password')
                      : (isAr ? 'إظهار كلمة المرور' : 'Show password')
                    }
                    style={isAr ? { left: '12px' } : { right: '12px' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Remember me + Forgot password row */}
              <motion.div
                className="flex items-center justify-between gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="admin-remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                    className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <Label
                    htmlFor="admin-remember"
                    className="text-sm font-normal text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                  >
                    {translations.rememberMe}
                  </Label>
                </div>
                <span className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium">
                  {translations.forgotPassword}
                </span>
              </motion.div>

              {/* Sign In button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-700/30 transition-all text-white gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isAr ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {translations.signIn}
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Secure connection note */}
              <motion.div
                className="flex items-center justify-center gap-1.5 pt-2 pb-1 text-xs text-gray-400 dark:text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ShieldCheck className="w-3 h-3" />
                {translations.secureNote}
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
