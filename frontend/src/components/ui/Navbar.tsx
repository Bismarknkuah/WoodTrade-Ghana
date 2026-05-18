'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// ─── Global Currency Store ────────────────────────────────────────────────────
export type Currency = 'GHS' | 'USD';
let globalCurrency: Currency = 'GHS';
const listeners: Set<(c: Currency) => void> = new Set();
export function getCurrency() { return globalCurrency; }
export function setCurrencyGlobal(c: Currency) {
  globalCurrency = c;
  if (typeof window !== 'undefined') localStorage.setItem('wtg_currency', c);
  listeners.forEach(fn => fn(c));
}
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(globalCurrency);
  useEffect(() => {
    const saved = localStorage.getItem('wtg_currency') as Currency | null;
    if (saved && saved !== globalCurrency) setCurrencyGlobal(saved);
    listeners.add(setCurrency);
    return () => { listeners.delete(setCurrency); };
  }, []);
  return { currency, setCurrency: setCurrencyGlobal };
}

export const GHS_TO_USD = 0.068;
export function convertPrice(ghsPrice: number, currency: Currency): string {
  if (currency === 'GHS') return `₵${ghsPrice.toLocaleString()}`;
  return `$${(ghsPrice * GHS_TO_USD).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const SUGGESTIONS = ['Odum Timber', 'Sapele', 'Teak', 'Bamboo Poles', 'Marine Plywood', 'Wawa', 'Mahogany', 'Edinam'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = false;
  const userName = 'Kofi A.';

  const notifications = [
    { id: 1, text: 'Your FLEGT license was approved', time: '2h ago', unread: true },
    { id: 2, text: 'New order from Timber USA Inc.', time: '5h ago', unread: true },
    { id: 3, text: 'License expires in 14 days', time: '1d ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setNotifOpen(false);
        setCurrencyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  const navBg = isHome && !scrolled ? 'bg-[#6b4f3a]' : 'bg-[#5a3e2b] shadow-lg';

  const filteredSuggestions = SUGGESTIONS.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-amber-600 text-white text-xs text-center py-1.5 px-4 hidden md:block">
        🌿 WoodTrade Ghana — Fully FLEGT · Lacey Act · EUDR compliant platform &nbsp;|&nbsp;
        <a href="/sell" className="underline font-semibold hover:text-amber-200">Start selling today →</a>
      </div>

      <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="text-white font-bold text-xl tracking-tight shrink-0 flex items-center gap-2">
              <span className="text-amber-400 text-2xl">🌳</span>
              <span>WoodTrade</span>
              <span className="text-amber-400 text-xs font-normal hidden lg:block">Ghana</span>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                    placeholder="Search species, products..."
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:bg-white/20 focus:border-amber-400 transition-all"
                  />
                </div>
              </form>
              {searchOpen && filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                  {filteredSuggestions.map(s => (
                    <button
                      key={s}
                      onMouseDown={() => { router.push(`/catalog?search=${encodeURIComponent(s)}`); setSearchQuery(''); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                    >
                      <span className="text-stone-400">🔍</span> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-3" ref={userMenuRef}>
              <Link href="/catalog" className={`text-white/90 hover:text-white text-sm font-medium transition-colors px-1 ${pathname === '/catalog' ? 'text-amber-400' : ''}`}>Catalog</Link>
              <Link href="/sell" className={`text-white/90 hover:text-white text-sm font-medium transition-colors px-1 ${pathname === '/sell' ? 'text-amber-400' : ''}`}>Sell</Link>
            <Link href="/carpentry" className={`text-white/90 hover:text-white text-sm font-medium transition-colors px-1 ${pathname === '/carpentry' ? 'text-amber-400' : ''}`}>Carpentry</Link>
              <Link href="/admin" className={`text-white/90 hover:text-white text-sm font-medium transition-colors px-1 ${pathname === '/admin' ? 'text-amber-400' : ''}`}>Admin</Link>

              {/* Currency switcher */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all"
                >
                  <span>{currency === 'GHS' ? '🇬🇭 GHS ₵' : '🌍 USD $'}</span>
                  <svg className={`w-3 h-3 transition-transform ${currencyMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {currencyMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                    <div className="px-3 py-2 text-xs text-stone-400 font-semibold uppercase tracking-wide border-b border-stone-100">Select Currency</div>
                    {([
                      { code: 'GHS', label: 'Ghana Cedi', flag: '🇬🇭', symbol: '₵', desc: 'Local market' },
                      { code: 'USD', label: 'US Dollar', flag: '🌍', symbol: '$', desc: 'International market' },
                    ] as const).map(c => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code); setCurrencyMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-amber-50 transition-all ${currency === c.code ? 'bg-amber-50 text-amber-800' : 'text-stone-700'}`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <div className="text-left">
                          <div className="font-semibold">{c.symbol} {c.label}</div>
                          <div className="text-xs text-stone-400">{c.desc}</div>
                        </div>
                        {currency === c.code && <span className="ml-auto text-amber-500">✓</span>}
                      </button>
                    ))}
                    <div className="px-3 py-2 border-t border-stone-100 text-xs text-stone-400 text-center">
                      Rate: 1 USD ≈ {(1 / GHS_TO_USD).toFixed(1)} GHS
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              {isLoggedIn && (
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                        <span className="font-bold text-stone-800">Notifications</span>
                        <span className="text-xs text-amber-600 font-semibold">{unreadCount} unread</span>
                      </div>
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-stone-50 hover:bg-stone-50 cursor-pointer ${n.unread ? 'bg-amber-50/50' : ''}`}>
                          <div className="flex items-start gap-3">
                            {n.unread && <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />}
                            <div className={!n.unread ? 'ml-5' : ''}>
                              <p className="text-sm text-stone-700">{n.text}</p>
                              <p className="text-xs text-stone-400 mt-0.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Link href="/dashboard" className="block text-center py-2.5 text-sm text-amber-700 font-semibold hover:bg-amber-50">View all →</Link>
                    </div>
                  )}
                </div>
              )}

              {/* Auth */}
              {isLoggedIn ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm font-semibold transition-all">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">{userName[0]}</div>
                    {userName}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50">
                      {[
                        { href: '/dashboard', label: '📊 Dashboard' },
                        { href: '/dashboard', label: '🪵 My Products' },
                        { href: '/dashboard', label: '📦 My Orders' },
                        { href: '/dashboard', label: '📋 Licenses' },
                      ].map((item, i) => (
                        <Link key={i} href={item.href} className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800">{item.label}</Link>
                      ))}
                      <div className="border-t border-stone-100">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">🚪 Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="border border-white text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-white hover:text-amber-800 transition-colors">Dashboard</Link>
                  <Link href="/auth/login" className="bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-5 py-1.5 rounded-lg transition-colors shadow-md">Login</Link>
                </div>
              )}
            </div>

            {/* Mobile icons */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setCurrency(currency === 'GHS' ? 'USD' : 'GHS')} className="text-xs font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1">
                {currency === 'GHS' ? '₵ GHS' : '$ USD'}
              </button>
              <button className="text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#4a3220] border-t border-white/10 pb-4 pt-2 px-4 flex flex-col gap-1">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </form>
            {[
              { href: '/catalog', label: '🪵 Catalog' },
              { href: '/sell', label: '💼 Sell' },
              { href: '/dashboard', label: '📊 Dashboard' },
              { href: '/admin', label: '⚙️ Admin' },
            ].map(item => (
              <Link key={item.href} href={item.href} className={`text-white font-medium py-2.5 px-3 rounded-lg hover:bg-white/10 transition-all ${pathname === item.href ? 'bg-white/10 text-amber-400' : ''}`} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
              <button onClick={() => setCurrency('GHS')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currency === 'GHS' ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/80'}`}>🇬🇭 GHS ₵</button>
              <button onClick={() => setCurrency('USD')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currency === 'USD' ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/80'}`}>🌍 USD $</button>
            </div>
            <Link href="/auth/login" className="bg-amber-500 text-white font-semibold px-4 py-2.5 rounded-lg text-center mt-2 hover:bg-amber-400 transition-all" onClick={() => setMobileOpen(false)}>Login / Register</Link>
          </div>
        )}
      </nav>
    </>
  );
}
