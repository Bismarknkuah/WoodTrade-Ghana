'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCurrency, convertPrice } from '../../components/ui/Navbar';
import { GHANA_REGIONS } from '../../lib/ghanaRegions';

// ─── Data ─────────────────────────────────────────────────────────────────────
const WOOD_CATEGORIES = ['All', 'Timber', 'Bamboo', 'Plywood', 'Engineered Wood', 'Lumber', 'Veneer'];
const CARPENTRY_CATEGORIES = ['All Carpentry', 'Furniture', 'Doors & Windows', 'Kitchen Cabinets', 'Wardrobes', 'Office Furniture', 'Outdoor Furniture', 'Custom Orders'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'sustainable', label: 'Most Sustainable' },
  { value: 'rating', label: 'Top Rated' },
];

// Mock wood products
const WOOD_PRODUCTS = [
  { id: '1', title: 'Prime Odum (Iroko) Timber', species: 'Milicia excelsa', category: 'Timber', price: 27206, unit: 'm³', seller: 'Asante Timber Co.', region: 'Ashanti', flegtVerified: true, fscCertified: true, laceyAct: true, eudr: true, sustainabilityScore: 92, stock: 240, rating: 4.8, reviews: 34 },
  { id: '2', title: 'Wawa Lumber — Kiln Dried', species: 'Triplochiton scleroxylon', category: 'Timber', price: 13529, unit: 'm³', seller: 'GreenForest Exports', region: 'Western', flegtVerified: true, fscCertified: false, laceyAct: true, eudr: true, sustainabilityScore: 78, stock: 380, rating: 4.5, reviews: 21 },
  { id: '3', title: 'Structural Bamboo Poles', species: 'Bambusa vulgaris', category: 'Bamboo', price: 4118, unit: 'bundle', seller: 'Volta Bamboo Farms', region: 'Volta', flegtVerified: false, fscCertified: false, laceyAct: true, eudr: false, sustainabilityScore: 96, stock: 1200, rating: 4.7, reviews: 58 },
  { id: '4', title: 'African Mahogany — Grade A', species: 'Khaya ivorensis', category: 'Timber', price: 35294, unit: 'm³', seller: 'Kumasi Wood Holdings', region: 'Ashanti', flegtVerified: true, fscCertified: true, laceyAct: true, eudr: true, sustainabilityScore: 88, stock: 120, rating: 4.9, reviews: 47 },
  { id: '5', title: 'Marine Plywood 18mm', species: 'Mixed Hardwood', category: 'Plywood', price: 10000, unit: 'sheet', seller: 'Tema Wood Supplies', region: 'Greater Accra', flegtVerified: true, fscCertified: true, laceyAct: true, eudr: true, sustainabilityScore: 82, stock: 800, rating: 4.6, reviews: 29 },
  { id: '6', title: 'Sapele Sawn Timber', species: 'Entandrophragma cylindricum', category: 'Timber', price: 24265, unit: 'm³', seller: 'Eastern Hardwoods Ltd', region: 'Eastern', flegtVerified: true, fscCertified: false, laceyAct: true, eudr: true, sustainabilityScore: 85, stock: 95, rating: 4.4, reviews: 18 },
  { id: '7', title: 'LVL Engineered Beams', species: 'Mixed species', category: 'Engineered Wood', price: 17647, unit: 'm³', seller: 'Kumasi Wood Holdings', region: 'Volta', flegtVerified: true, fscCertified: false, laceyAct: false, eudr: false, sustainabilityScore: 84, stock: 200, rating: 4.3, reviews: 12 },
  { id: '8', title: 'OSB Sheets 12mm', species: 'Mixed species', category: 'Engineered Wood', price: 5294, unit: 'sheet', seller: 'Kumasi Wood Holdings', region: 'Western', flegtVerified: true, fscCertified: false, laceyAct: false, eudr: false, sustainabilityScore: 92, stock: 600, rating: 4.5, reviews: 22 },
  { id: '9', title: 'Ghana Teak Planks', species: 'Tectona grandis', category: 'Timber', price: 66176, unit: 'm³', seller: 'Ashanti Forest Products', region: 'Brong-Ahafo', flegtVerified: true, fscCertified: true, laceyAct: true, eudr: true, sustainabilityScore: 95, stock: 38, rating: 5.0, reviews: 63 },
  { id: '10', title: 'Bamboo Composite Board', species: 'Bambusa vulgaris', category: 'Bamboo', price: 6176, unit: 'sheet', seller: 'Volta Bamboo Farms', region: 'Volta', flegtVerified: false, fscCertified: false, laceyAct: true, eudr: false, sustainabilityScore: 97, stock: 450, rating: 4.6, reviews: 31 },
];

// Mock carpentry products
const CARPENTRY_PRODUCTS = [
  { id: 'c1', title: 'Executive Office Desk — Mahogany', category: 'Office Furniture', price: 4500, unit: 'piece', seller: 'Kofi Craftworks', region: 'Greater Accra', wood: 'Mahogany', finish: 'Lacquer', leadTime: '2 weeks', rating: 4.9, reviews: 28, customizable: true, image: '🪑' },
  { id: 'c2', title: 'Built-in Kitchen Cabinets (Per Linear Metre)', category: 'Kitchen Cabinets', price: 1200, unit: 'linear m', seller: 'AccraWood Interiors', region: 'Greater Accra', wood: 'Odum + MDF', finish: 'PVC Wrapped', leadTime: '3 weeks', rating: 4.7, reviews: 42, customizable: true, image: '🚪' },
  { id: 'c3', title: '6-Door Sliding Wardrobe', category: 'Wardrobes', price: 6800, unit: 'piece', seller: 'Kumasi Furniture Hub', region: 'Ashanti', wood: 'Wawa + Mirror', finish: 'Painted', leadTime: '2 weeks', rating: 4.8, reviews: 19, customizable: true, image: '🚪' },
  { id: 'c4', title: 'Solid Wood Dining Set (6 Seater)', category: 'Furniture', price: 8500, unit: 'set', seller: 'Kofi Craftworks', region: 'Greater Accra', wood: 'Sapele', finish: 'Oil Finish', leadTime: '4 weeks', rating: 4.9, reviews: 37, customizable: false, image: '🪑' },
  { id: 'c5', title: 'Hardwood Entry Door (Custom Size)', category: 'Doors & Windows', price: 2200, unit: 'piece', seller: 'Tema Doors & Frames', region: 'Greater Accra', wood: 'Odum (Iroko)', finish: 'Varnish', leadTime: '1 week', rating: 4.6, reviews: 55, customizable: true, image: '🚪' },
  { id: 'c6', title: 'Garden/Outdoor Bench — Teak', category: 'Outdoor Furniture', price: 1800, unit: 'piece', seller: 'GreenCraft Ghana', region: 'Eastern', wood: 'Teak', finish: 'Teak Oil', leadTime: '1 week', rating: 4.8, reviews: 24, customizable: false, image: '🪑' },
  { id: 'c7', title: 'Custom Reception Desk', category: 'Office Furniture', price: 7500, unit: 'piece', seller: 'AccraWood Interiors', region: 'Greater Accra', wood: 'Mahogany + Glass', finish: 'Lacquer', leadTime: '3 weeks', rating: 5.0, reviews: 16, customizable: true, image: '🪑' },
  { id: 'c8', title: 'Louvred Wooden Windows (Per Unit)', category: 'Doors & Windows', price: 380, unit: 'unit', seller: 'Tema Doors & Frames', region: 'Greater Accra', wood: 'Wawa', finish: 'Painted', leadTime: '5 days', rating: 4.4, reviews: 33, customizable: true, image: '🪟' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-xs ${s <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200'}`}>★</span>
      ))}
      <span className="text-xs text-stone-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function WoodProductCard({ p, viewMode, currency }: any) {
  const displayPrice = currency === 'GHS' ? p.price : Math.round(p.price * 0.068);
  const symbol = currency === 'GHS' ? '₵' : '$';

  return (
    <Link href={`/catalog/${p.id}`}>
      <div className={`bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
        {/* Image */}
        <div className={`bg-gradient-to-br from-amber-50 to-stone-100 relative flex-shrink-0 ${viewMode === 'list' ? 'w-32 h-full min-h-[100px]' : 'h-44'}`}>
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🌲</div>
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {p.flegtVerified && <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">FLEGT</span>}
            {p.fscCertified && <span className="bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">FSC</span>}
            {p.laceyAct && <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">🇺🇸</span>}
            {p.eudr && <span className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">🇪🇺</span>}
          </div>
          <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg px-2 py-0.5 text-xs font-bold text-green-700">
            {p.sustainabilityScore}/100 🌿
          </div>
        </div>
        {/* Info */}
        <div className="p-4 flex-1">
          <p className="text-xs text-stone-400 italic">{p.species}</p>
          <h3 className="font-semibold text-stone-900 text-sm leading-tight mt-0.5 group-hover:text-amber-700 transition-colors line-clamp-2">{p.title}</h3>
          <p className="text-xs text-stone-500 mt-1">📍 {p.region} • {p.seller}</p>
          <StarRating rating={p.rating} />
          <p className="text-xs text-stone-400">{p.reviews} reviews</p>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-bold text-amber-700">{symbol}{displayPrice.toLocaleString()}</span>
              <span className="text-stone-400 text-xs"> /{p.unit}</span>
            </div>
            <span className="text-xs text-stone-400">{p.stock} {p.unit} left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CarpentryCard({ p, viewMode, currency }: any) {
  const displayPrice = currency === 'GHS' ? p.price : Math.round(p.price * 0.068);
  const symbol = currency === 'GHS' ? '₵' : '$';

  return (
    <Link href={`/carpentry/${p.id}`}>
      <div className={`bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
        <div className={`bg-gradient-to-br from-amber-100 to-stone-200 relative flex-shrink-0 ${viewMode === 'list' ? 'w-32 h-full min-h-[100px]' : 'h-44'}`}>
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40">{p.image}</div>
          {p.customizable && (
            <div className="absolute top-2 left-2">
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">✏️ Custom</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg px-2 py-0.5 text-xs font-semibold text-amber-700">
            {p.leadTime}
          </div>
        </div>
        <div className="p-4 flex-1">
          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">{p.category}</span>
          <h3 className="font-semibold text-stone-900 text-sm leading-tight mt-1.5 group-hover:text-amber-700 transition-colors line-clamp-2">{p.title}</h3>
          <p className="text-xs text-stone-500 mt-1">📍 {p.region} • {p.seller}</p>
          <p className="text-xs text-stone-400 mt-0.5">🪵 {p.wood} • {p.finish}</p>
          <StarRating rating={p.rating} />
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-bold text-amber-700">{symbol}{displayPrice.toLocaleString()}</span>
              <span className="text-stone-400 text-xs"> /{p.unit}</span>
            </div>
            {p.customizable && <span className="text-xs text-purple-600 font-semibold">Made to order</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initTab = searchParams.get('tab') === 'carpentry' ? 'carpentry' : 'wood';
  const [tab, setTab] = useState<'wood' | 'carpentry'>(initTab as any);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [carpentryCategory, setCarpentryCategory] = useState('All Carpentry');
  const [region, setRegion] = useState('All Regions');
  const [laceyOnly, setLaceyOnly] = useState(false);
  const [flegtOnly, setFlegtOnly] = useState(false);
  const [fscOnly, setFscOnly] = useState(false);
  const [customOnly, setCustomOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { currency } = useCurrency();

  const regionNames = ['All Regions', ...GHANA_REGIONS.map(r => r.name)];

  const filteredWood = WOOD_PRODUCTS.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (region !== 'All Regions' && p.region !== region) return false;
    if (laceyOnly && !p.laceyAct) return false;
    if (flegtOnly && !p.flegtVerified) return false;
    if (fscOnly && !p.fscCertified) return false;
    const price = currency === 'GHS' ? p.price : Math.round(p.price * 0.068);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.species.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredCarpentry = CARPENTRY_PRODUCTS.filter(p => {
    if (carpentryCategory !== 'All Carpentry' && p.category !== carpentryCategory) return false;
    if (region !== 'All Regions' && p.region !== region) return false;
    if (customOnly && !p.customizable) return false;
    const price = currency === 'GHS' ? p.price : Math.round(p.price * 0.068);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const displayProducts = tab === 'wood' ? filteredWood : filteredCarpentry;

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-[#5a3e2b] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {tab === 'wood' ? 'Wood Catalog' : 'Carpentry Works'}
          </h1>
          <p className="text-amber-200 text-sm">
            {tab === 'wood'
              ? 'Browse verified Ghanaian timber, bamboo, plywood & engineered wood'
              : 'Handcrafted furniture, doors, cabinets & custom woodwork by Ghana\'s finest carpenters'}
          </p>
          {/* Tab switcher */}
          <div className="flex gap-3 mt-5">
            <button onClick={() => setTab('wood')}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${tab === 'wood' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              🪵 Raw Wood Materials
            </button>
            <button onClick={() => setTab('carpentry')}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${tab === 'carpentry' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              🪑 Carpentry Works
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <svg className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tab === 'wood' ? 'Search by species, product name...' : 'Search furniture, doors, cabinets...'}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-lg">×</button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-20 space-y-5">
              <h2 className="font-bold text-stone-900">Filters</h2>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Category</label>
                <div className="flex flex-col gap-1">
                  {(tab === 'wood' ? WOOD_CATEGORIES : CARPENTRY_CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => tab === 'wood' ? setCategory(cat) : setCarpentryCategory(cat)}
                      className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        (tab === 'wood' ? category : carpentryCategory) === cat
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Region</label>
                <select value={region} onChange={e => setRegion(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                  {regionNames.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">
                  Price ({currency === 'GHS' ? 'GHS ₵' : 'USD $'})
                </label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-amber-400" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              {/* Compliance — wood only */}
              {tab === 'wood' && (
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Compliance</label>
                  <div className="space-y-2">
                    {[
                      { label: '🇺🇸 Lacey Act', state: laceyOnly, set: setLaceyOnly },
                      { label: '🇬🇭 FLEGT Verified', state: flegtOnly, set: setFlegtOnly },
                      { label: '🌿 FSC Certified', state: fscOnly, set: setFscOnly },
                    ].map(f => (
                      <label key={f.label} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={f.state} onChange={e => f.set(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                        <span className="text-sm text-stone-700">{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Carpentry filters */}
              {tab === 'carpentry' && (
                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Options</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={customOnly} onChange={e => setCustomOnly(e.target.checked)} className="accent-amber-500 w-4 h-4" />
                    <span className="text-sm text-stone-700">✏️ Customizable Only</span>
                  </label>
                </div>
              )}

              {/* Reset */}
              <button onClick={() => { setCategory('All'); setCarpentryCategory('All Carpentry'); setRegion('All Regions'); setMinPrice(''); setMaxPrice(''); setLaceyOnly(false); setFlegtOnly(false); setFscOnly(false); setCustomOnly(false); setSearch(''); }}
                className="w-full text-xs text-stone-500 hover:text-amber-700 py-2 border border-stone-200 rounded-lg hover:border-amber-300 transition-all">
                ↺ Reset Filters
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-stone-500 text-sm">
                <strong className="text-stone-900">{displayProducts.length}</strong> {tab === 'wood' ? 'products' : 'items'} found
              </p>
              <div className="flex items-center gap-3">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex rounded-lg border border-stone-200 overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-stone-500'}`}>⊞</button>
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-stone-500'}`}>≡</button>
                </div>
              </div>
            </div>

            {/* Carpentry CTA banner */}
            {tab === 'carpentry' && (
              <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Need Something Custom?</h3>
                  <p className="text-amber-100 text-sm">Describe exactly what you need and get quotes from verified carpenters across Ghana.</p>
                </div>
                <Link href="/carpentry/request" className="bg-white text-amber-800 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-50 transition-all shrink-0 ml-4">
                  Request Custom Work →
                </Link>
              </div>
            )}

            {/* Products */}
            {displayProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
                {displayProducts.map(p =>
                  tab === 'wood'
                    ? <WoodProductCard key={p.id} p={p} viewMode={viewMode} currency={currency} />
                    : <CarpentryCard key={p.id} p={p} viewMode={viewMode} currency={currency} />
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-stone-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-stone-700">No results found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search term</p>
                <button onClick={() => { setSearch(''); setCategory('All'); setCarpentryCategory('All Carpentry'); setRegion('All Regions'); }}
                  className="mt-4 text-amber-700 underline text-sm">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center py-20 text-stone-500">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
