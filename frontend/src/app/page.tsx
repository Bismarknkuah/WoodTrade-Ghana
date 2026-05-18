'use client';
import Link from 'next/link';
import NoticeTicker from '../components/ui/NoticeTicker';
import { useState, useEffect } from 'react';

const WOOD_CATEGORIES = [
  { name: 'Timber', icon: '🌲', count: '240+', desc: 'Odum, Wawa, Mahogany & more' },
  { name: 'Bamboo', icon: '🎋', count: '80+', desc: 'Structural & decorative bamboo' },
  { name: 'Plywood', icon: '📋', count: '120+', desc: 'Marine, hardwood & softwood' },
  { name: 'Engineered Wood', icon: '🪵', count: '95+', desc: 'LVL, MDF, OSB, Glulam' },
];

const STATS = [
  { value: '1,200+', label: 'Verified Suppliers' },
  { value: '45+', label: 'Export Countries' },
  { value: '98%', label: 'Compliance Rate' },
  { value: 'GHS/USD', label: 'Dual Currency' },
];

const FEATURED_PRODUCTS = [
  {
    id: '1', title: 'Prime Odum (Iroko) Timber', species: 'Milicia excelsa',
    price: 1850, currency: 'USD', unit: 'm³', seller: 'Asante Timber Co.',
    region: 'Ashanti Region', flegtVerified: true, fscCertified: false,
    laceyAct: true, image: '/images/odum-timber.jpg', sustainabilityScore: 82,
  },
  {
    id: '2', title: 'Wawa (Obeche) Lumber — Kiln Dried', species: 'Triplochiton scleroxylon',
    price: 920, currency: 'USD', unit: 'm³', seller: 'GreenForest Exports Ltd.',
    region: 'Western Region', flegtVerified: true, fscCertified: true,
    laceyAct: true, image: '/images/wawa-lumber.jpg', sustainabilityScore: 91,
  },
  {
    id: '3', title: 'Bamboo Structural Poles — Bundle', species: 'Bambusa vulgaris',
    price: 280, currency: 'USD', unit: 'bundle', seller: 'Volta Bamboo Farms',
    region: 'Volta Region', flegtVerified: false, fscCertified: false,
    laceyAct: true, image: '/images/bamboo.jpg', sustainabilityScore: 95,
  },
  {
    id: '4', title: 'Mahogany Sawn Timber — Grade A', species: 'Khaya ivorensis',
    price: 2400, currency: 'USD', unit: 'm³', seller: 'Kumasi Wood Holdings',
    region: 'Ashanti Region', flegtVerified: true, fscCertified: true,
    laceyAct: true, image: '/images/mahogany.jpg', sustainabilityScore: 88,
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse & Filter', desc: 'Search verified products by species, grade, price, and compliance certifications.' },
  { step: '02', title: 'Verify Suppliers', desc: 'Check TIDD licenses, FLEGT status, FSC certification, and sustainability scores.' },
  { step: '03', title: 'Order & Pay', desc: 'Place orders securely via Mobile Money, Stripe, or bank transfer in GHS or USD.' },
  { step: '04', title: 'Export Ready', desc: 'Auto-generate Lacey Act declarations, EUDR documents, and shipping paperwork.' },
];

function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
  return (
    <div className="card group cursor-pointer">
      <div className="relative h-52 bg-gradient-to-br from-amber-100 to-stone-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🌲</div>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {product.flegtVerified && (
            <span className="badge-flegt">✓ FLEGT</span>
          )}
          {product.fscCertified && (
            <span className="badge-fsc">✓ FSC</span>
          )}
          {product.laceyAct && (
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              🇺🇸 Lacey Act
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-green-700 shadow">
          {product.sustainabilityScore}/100 🌿
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-stone-500 italic mb-1">{product.species}</p>
        <h3 className="font-semibold text-stone-900 text-base leading-tight mb-1 group-hover:text-amber-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-stone-500 mb-3">
          📍 {product.region} • {product.seller}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-amber-700">${product.price.toLocaleString()}</span>
            <span className="text-stone-500 text-sm"> / {product.unit}</span>
          </div>
          <Link
            href={`/catalog/${product.id}`}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* ===== HERO SECTION (matches screenshot exactly) ===== */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden">
        {/* Background - warm wood-house photo simulation with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-amber-900 to-stone-800">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-white font-serif leading-tight mb-6">
              Ghana&apos;s Premium<br />Wood Marketplace
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Verified suppliers • Transparent pricing • Timber • Bamboo • Plywood • Engineered Wood
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="btn-primary underline underline-offset-2 flex items-center gap-2"
              >
                Browse Catalog →
              </Link>
              <Link href="/sell" className="btn-outline flex items-center gap-2">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-wood-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-amber-400">{s.value}</div>
                <div className="text-stone-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading">Browse by Category</h2>
          <p className="text-stone-500 mt-3">Every product traced from Ghana&apos;s forests to your door</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {WOOD_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog?category=${cat.name.toLowerCase().replace(' ', '_')}`}
              className="card p-6 text-center hover:border-amber-400 hover:shadow-amber-100 group transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">{cat.name}</h3>
              <p className="text-amber-600 font-semibold text-sm">{cat.count} products</p>
              <p className="text-stone-500 text-xs mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-12 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-heading">Featured Products</h2>
            <Link href="/catalog" className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPLIANCE BANNER ===== */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
                Export-Ready. Legally Compliant.
              </h2>
              <p className="text-amber-100 text-lg mb-6">
                WoodTrade automatically generates Lacey Act declarations for US imports,
                EUDR due diligence for Europe, and full FLEGT documentation — saving you days of paperwork.
              </p>
              <div className="flex flex-wrap gap-3">
                {['🇺🇸 Lacey Act (USA)', '🇪🇺 EUDR (Europe)', '✓ FLEGT License', '📋 Certificate of Origin', '🌿 TIDD Ghana'].map((tag) => (
                  <span key={tag} className="bg-amber-600 border border-amber-500 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🔍', title: 'Full Traceability', desc: 'Forest → Sawmill → Port → Buyer' },
                { icon: '📄', title: 'Auto-Documents', desc: 'Generate Lacey Act declarations in 1 click' },
                { icon: '🛡️', title: 'Verified Sellers', desc: 'All TIDD & Forestry Commission licenses verified' },
                { icon: '📦', title: 'QR Product Passport', desc: 'Every shipment gets a digital product ID' },
              ].map((f) => (
                <div key={f.title} className="bg-amber-800/50 rounded-xl p-4">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                  <div className="text-amber-200 text-xs">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-heading">How It Works</h2>
          <p className="text-stone-500 mt-3">From browsing to export-ready shipment in four steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative">
              <div className="text-5xl font-black text-amber-100 mb-4">{step.step}</div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-6 right-0 translate-x-1/2 text-amber-300 text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-stone-900 to-amber-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            Ready to grow your wood business?
          </h2>
          <p className="text-stone-300 text-lg mb-8">
            Join 1,200+ verified Ghanaian timber businesses on Africa&apos;s most trusted wood marketplace.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register?role=buyer" className="btn-primary text-base">
              Start Buying
            </Link>
            <Link href="/sell" className="btn-outline text-base">
              List Your Products
            </Link>
          </div>
        </div>
      </section>
      {/* ===== NOTICE TICKER ===== */}
      <NoticeTicker />

      {/* ===== DEVELOPER CREDIT ===== */}
      <section className="py-6 bg-[#2a1a0e] text-center">
        <p className="text-stone-500 text-xs">
          🎓 Designed &amp; Developed by a <strong className="text-amber-500">PhD Candidate, University of Ghana</strong>
          &nbsp;·&nbsp;
          <a href="tel:0240715156" className="text-amber-400 hover:text-amber-300">📞 0240715156</a>
          &nbsp;·&nbsp;
          <a href="mailto:baristernkuah@gmail.com" className="text-amber-400 hover:text-amber-300">✉️ baristernkuah@gmail.com</a>
        </p>
      </section>
    </>
  );
}
