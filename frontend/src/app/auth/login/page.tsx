'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.toLowerCase().trim(), password: form.password }),
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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#5a3e2b]">
            <span className="text-3xl">🌳</span> WoodTrade Ghana
          </Link>
          <h1 className="text-xl font-bold text-stone-900 mt-4">Welcome back</h1>
          <p className="text-stone-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1.5">Email Address</label>
            <input
              type="email" value={form.email} autoComplete="email"
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="kwame@timber.com"
              className="input-field"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-stone-700">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-amber-700 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={form.password} autoComplete="current-password"
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Your password"
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-5 bg-stone-50 border border-stone-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-stone-600 mb-2">🧪 Demo Accounts</p>
          <div className="space-y-1.5">
            {[
              { role: 'Admin', email: 'admin@woodtrade.gh', pass: 'Admin@1234' },
              { role: 'Seller', email: 'kofi@ashantiforest.gh', pass: 'Seller@1234' },
              { role: 'Buyer', email: 'buyer@timberusa.com', pass: 'Buyer@1234' },
            ].map(a => (
              <button key={a.role} onClick={() => setForm({ email: a.email, password: a.pass })}
                className="w-full text-left text-xs bg-white border border-stone-200 hover:border-amber-300 rounded-lg px-3 py-2 transition-all">
                <span className="font-semibold text-amber-700">{a.role}:</span>{' '}
                <span className="text-stone-600">{a.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2">Run <code className="bg-stone-100 px-1 rounded">npm run seed</code> in backend first</p>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-amber-700 font-semibold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
