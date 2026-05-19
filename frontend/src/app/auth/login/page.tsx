'use client';
import { useState } from 'react';
import Link from 'next/link';

const ROLES = [
  { value: 'buyer', label: '🛒 Buyer', desc: 'Purchase wood products' },
  { value: 'seller', label: '🌳 Seller / Harvester', desc: 'Sell raw timber' },
  { value: 'carpenter', label: '🪑 Carpenter', desc: 'Sell furniture & finished woodwork' },
  { value: 'manufacturer', label: '🏭 Manufacturer', desc: 'Sell processed wood products' },
  { value: 'reseller', label: '🚢 Reseller / Exporter', desc: 'Trade & export wood' },
  { value: 'admin', label: '⚙️ Admin', desc: 'Platform administration' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const selectedRole = ROLES.find(r => r.value === form.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://woodtrade-ghana-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Login failed');
      localStorage.setItem('wt_token', data.token);
      localStorage.setItem('wt_user', JSON.stringify(data.user));
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      window.location.href = redirectTo;
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="text-4xl">🌳</span>
            <div className="text-left">
              <div className="text-2xl font-bold text-[#5a3e2b]" style={{ fontFamily: 'Georgia, serif' }}>WoodTrade</div>
              <div className="text-xs text-amber-700 font-semibold tracking-widest uppercase">Ghana</div>
            </div>
          </Link>
          <p className="text-stone-500 text-sm mt-3">Ghana&apos;s Premium Wood Marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">

          {/* Card Header */}
          <div className="bg-[#5a3e2b] px-8 py-6 text-white">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Welcome Back</h1>
            <p className="text-amber-200 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Role Dropdown */}
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Signing in as</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(!roleOpen)}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between bg-white hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  >
                    <span className={selectedRole ? 'text-stone-900 font-medium' : 'text-stone-400'}>
                      {selectedRole ? selectedRole.label : '— Select your role (optional) —'}
                    </span>
                    <span className={`text-stone-400 transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>

                  {roleOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                      {ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            setForm(f => ({ ...f, role: role.value }));
                            setRoleOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-amber-50 transition-all border-b border-stone-100 last:border-0 ${
                            form.role === role.value ? 'bg-amber-50' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-stone-900 text-sm">{role.label}</p>
                            <p className="text-stone-400 text-xs">{role.desc}</p>
                          </div>
                          {form.role === role.value && <span className="text-amber-500 font-bold text-sm">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="kwame@timber.com"
                  className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-stone-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-amber-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    autoComplete="current-password"
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Your password"
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm px-1"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5a3e2b] hover:bg-[#4a3220] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs text-stone-400">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            {/* Browse as Guest */}
            <Link
              href="/catalog"
              className="w-full block text-center border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-700 font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Browse Catalog as Guest →
            </Link>

          </div>

          {/* Card Footer */}
          <div className="px-8 py-4 bg-stone-50 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-amber-700 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-stone-400 text-xs mt-6">
          🔒 Secured by WoodTrade Ghana Compliance Engine
        </p>
      </div>
    </div>
  );
}