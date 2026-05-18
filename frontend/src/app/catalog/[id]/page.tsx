'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock product data – replace with real API fetch
const mockProduct = {
  id: '1',
  productPassportId: 'WTG-1704067200000-ABC123456',
  name: 'Premium Odum Timber (Iroko)',
  species: 'Milicia excelsa',
  category: 'Timber',
  description:
    'High-grade Odum timber (Iroko) harvested from sustainable forest reserves in the Ashanti Region. Known for its exceptional durability, insect resistance, and rich golden-brown colour. Ideal for furniture, flooring, decking, and marine applications.',
  seller: {
    name: 'Ashanti Forest Products Ltd.',
    verified: true,
    region: 'Ashanti',
    rating: 4.8,
    totalSales: 312,
    memberSince: 'March 2022',
    flegtLicenseNumber: 'FLEGT-GH-2024-00412',
  },
  price: { ghs: 2800, usd: 192 },
  unit: 'per cubic metre',
  minOrder: 5,
  stock: 84,
  region: 'Ashanti',
  harvestingLocation: 'Offinso North, Ashanti Region, Ghana (6.4°N, 1.9°W)',
  dimensions: { length: 'Various', width: 'Various', thickness: '25mm–100mm' },
  moisture: '12–15%',
  grading: 'Grade A (Select)',
  flegtVerified: true,
  fscCertified: true,
  laceyActCompliant: true,
  eudrCompliant: true,
  sustainabilityScore: 92,
  certifications: ['FLEGT', 'FSC', 'PEFC', 'Lacey Act Ready', 'EUDR Ready'],
  images: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  ],
  traceabilityLog: [
    {
      id: 1,
      event: 'Harvesting',
      location: 'Offinso North Forest Reserve, Ashanti',
      date: '2024-11-03',
      actor: 'Ashanti Forest Products Ltd.',
      hash: 'a3f9e2c1b4d8…',
      icon: '🌳',
    },
    {
      id: 2,
      event: 'FLEGT Verification',
      location: 'Forestry Commission, Kumasi',
      date: '2024-11-10',
      actor: 'Ghana Forestry Commission',
      hash: 'b7d1c5a2e9f3…',
      icon: '📋',
    },
    {
      id: 3,
      event: 'Milling / Processing',
      location: 'Kumasi Industrial Area, Ashanti',
      date: '2024-11-18',
      actor: 'KumaSaw Processing Ltd.',
      hash: 'c2e4f6a8b1d3…',
      icon: '⚙️',
    },
    {
      id: 4,
      event: 'Quality Inspection',
      location: 'WoodTrade QC Centre, Accra',
      date: '2024-11-25',
      actor: 'WoodTrade Ghana QC Team',
      hash: 'd5b9c3a7e1f2…',
      icon: '✅',
    },
    {
      id: 5,
      event: 'Listed on WoodTrade',
      location: 'WoodTrade Platform',
      date: '2024-12-01',
      actor: 'WoodTrade Ghana',
      hash: 'e8a1d4c6b2f9…',
      icon: '🏪',
    },
  ],
  relatedProducts: [
    { id: '2', name: 'Sapele Hardwood', price: 3200, species: 'Entandrophragma cylindricum', category: 'Timber', score: 88 },
    { id: '3', name: 'Wawa Softwood', price: 1400, species: 'Triplochiton scleroxylon', category: 'Timber', score: 78 },
    { id: '4', name: 'Ghana Teak', price: 4500, species: 'Tectona grandis', category: 'Timber', score: 95 },
  ],
};

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'traceability' | 'compliance' | 'seller'>('details');
  const [quantity, setQuantity] = useState(mockProduct.minOrder);
  const [currency, setCurrency] = useState<'GHS' | 'USD'>('GHS');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const price = currency === 'GHS' ? mockProduct.price.ghs : mockProduct.price.usd;
  const symbol = currency === 'GHS' ? 'GHS' : 'USD';
  const total = price * quantity;

  const tabs = [
    { key: 'details', label: 'Product Details' },
    { key: 'traceability', label: '🔗 Traceability' },
    { key: 'compliance', label: '📋 Compliance' },
    { key: 'seller', label: '👤 Seller Info' },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-amber-700">Home</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-amber-700">Catalog</Link>
            <span>/</span>
            <span className="text-stone-800 font-medium">{mockProduct.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Grid: Images + Purchase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-stone-200 aspect-video mb-3 shadow-md">
              <img
                src={mockProduct.images[activeImage]}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {mockProduct.flegtVerified && (
                  <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">FLEGT ✓</span>
                )}
                {mockProduct.fscCertified && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">FSC ✓</span>
                )}
                {mockProduct.laceyActCompliant && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Lacey Act ✓</span>
                )}
              </div>
              {/* Sustainability score */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow text-center">
                <div className="text-2xl font-bold text-green-600">{mockProduct.sustainabilityScore}</div>
                <div className="text-xs text-stone-600 font-medium">Sustainability</div>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {mockProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-amber-500 shadow-md scale-105' : 'border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Product Passport QR Placeholder */}
            <div className="mt-4 bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-3xl">📱</div>
              <div>
                <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">Digital Product Passport</div>
                <div className="font-mono text-sm text-stone-700 font-semibold">{mockProduct.productPassportId}</div>
                <div className="text-xs text-amber-700 mt-1">Scan QR to verify origin on mobile</div>
              </div>
            </div>
          </div>

          {/* Purchase Panel */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {mockProduct.category}
              </span>
              {mockProduct.seller.verified && (
                <span className="text-sm text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                  ✅ Verified Seller
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {mockProduct.name}
            </h1>
            <p className="text-stone-500 italic mb-4">{mockProduct.species}</p>

            <p className="text-stone-600 mb-6 leading-relaxed">{mockProduct.description}</p>

            {/* Price */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-3xl font-bold text-stone-900">{symbol} {price.toLocaleString()}</span>
                  <span className="text-stone-500 ml-2 text-sm">{mockProduct.unit}</span>
                </div>
                <div className="flex gap-1 bg-white rounded-lg border border-stone-200 p-1">
                  {(['GHS', 'USD'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${
                        currency === c ? 'bg-amber-500 text-white' : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-stone-700">Quantity (m³):</label>
                <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(mockProduct.minOrder, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-l-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-r-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-500">Min: {mockProduct.minOrder} m³</span>
              </div>

              <div className="flex items-center justify-between text-sm text-stone-600 mb-4 border-t border-amber-200 pt-3">
                <span>Subtotal:</span>
                <span className="font-bold text-lg text-stone-900">{symbol} {total.toLocaleString()}</span>
              </div>

              <div className="text-xs text-stone-500 mb-4">
                +12.5% VAT • Shipping quoted separately • {mockProduct.stock} m³ in stock
              </div>

              {orderSuccess ? (
                <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="font-bold text-green-800">Order Placed Successfully!</div>
                  <Link href="/dashboard" className="text-green-700 underline text-sm">View in Dashboard →</Link>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setOrderSuccess(true)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Place Order
                  </button>
                  <button className="px-4 py-3 border-2 border-stone-300 hover:border-amber-400 rounded-xl text-stone-700 hover:text-amber-700 transition-all font-medium">
                    💬 Enquire
                  </button>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Region', value: mockProduct.region, icon: '📍' },
                { label: 'Moisture', value: mockProduct.moisture, icon: '💧' },
                { label: 'Grading', value: mockProduct.grading, icon: '⭐' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-semibold text-stone-900 text-xs">{s.value}</div>
                  <div className="text-xs text-stone-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-10">
          {/* Tab Bar */}
          <div className="flex border-b border-stone-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-stone-800 mb-4 text-lg">Specifications</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Scientific Name', mockProduct.species],
                        ['Category', mockProduct.category],
                        ['Origin', mockProduct.harvestingLocation],
                        ['Thickness', mockProduct.dimensions.thickness],
                        ['Moisture Content', mockProduct.moisture],
                        ['Grading', mockProduct.grading],
                        ['Min. Order', `${mockProduct.minOrder} m³`],
                        ['Available Stock', `${mockProduct.stock} m³`],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-stone-100">
                          <td className="py-2.5 text-stone-500 font-medium w-40">{k}</td>
                          <td className="py-2.5 text-stone-900 font-semibold">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 mb-4 text-lg">Certifications</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mockProduct.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-green-100 text-green-800 border border-green-200 text-sm font-semibold px-3 py-1.5 rounded-full"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-stone-800 mb-3 text-lg">Typical Applications</h3>
                  <ul className="text-stone-600 text-sm space-y-2">
                    {['Furniture manufacturing', 'Interior flooring & decking', 'Marine & outdoor structures', 'Doors, windows & staircases', 'Export to USA, Europe, Asia'].map((u) => (
                      <li key={u} className="flex items-center gap-2">
                        <span className="text-amber-500">▸</span> {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TRACEABILITY TAB */}
            {activeTab === 'traceability' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-bold text-stone-800 text-lg">Chain of Custody Log</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 font-semibold px-2.5 py-1 rounded-full">
                    Blockchain-Verified
                  </span>
                </div>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[26px] top-0 bottom-0 w-0.5 bg-amber-200" />
                  <div className="space-y-6">
                    {mockProduct.traceabilityLog.map((entry, i) => (
                      <div key={entry.id} className="flex gap-4 relative">
                        <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl shrink-0 z-10">
                          {entry.icon}
                        </div>
                        <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-4 hover:border-amber-300 transition-all">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-stone-900">{entry.event}</h4>
                            <span className="text-xs text-stone-400 font-mono">{entry.date}</span>
                          </div>
                          <p className="text-sm text-stone-600 mb-1">📍 {entry.location}</p>
                          <p className="text-sm text-stone-500 mb-2">👤 {entry.actor}</p>
                          <div className="font-mono text-xs text-stone-400 bg-stone-100 rounded px-2 py-1 inline-block">
                            Hash: {entry.hash}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPLIANCE TAB */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                {[
                  {
                    title: '🇺🇸 Lacey Act (USA)',
                    status: 'compliant',
                    items: [
                      { label: 'Scientific name declared', ok: true },
                      { label: 'Country of harvest: Ghana', ok: true },
                      { label: 'Quantity and value declared', ok: true },
                      { label: 'APHIS PPQ 505 form ready', ok: true },
                    ],
                    note: 'This product is fully compliant for export to the United States under the Lacey Act. Download the pre-filled APHIS PPQ 505 form from your dashboard after placing an order.',
                  },
                  {
                    title: '🇪🇺 EU Deforestation Regulation (EUDR)',
                    status: 'compliant',
                    items: [
                      { label: 'Geolocation of plot recorded', ok: true },
                      { label: 'Legal harvesting confirmed', ok: true },
                      { label: 'No deforestation after Dec 2020', ok: true },
                      { label: 'Due diligence statement ready', ok: true },
                    ],
                    note: 'Compliant with EU Regulation 2023/1115. Geolocation coordinates available for DDS submission.',
                  },
                  {
                    title: '🇬🇭 FLEGT License (Ghana)',
                    status: 'verified',
                    items: [
                      { label: 'FLEGT License issued', ok: true },
                      { label: `License No: ${mockProduct.seller.flegtLicenseNumber}`, ok: true },
                      { label: 'Ghana Forestry Commission verified', ok: true },
                    ],
                    note: 'A valid FLEGT Timber Utilization Contract (TUC) has been verified by the Ghana Forestry Commission.',
                  },
                ].map((section) => (
                  <div key={section.title} className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="font-bold text-stone-800 text-lg">{section.title}</h4>
                      <span className="text-xs bg-green-100 text-green-700 border border-green-200 font-bold px-2.5 py-1 rounded-full uppercase">
                        ✓ {section.status}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {section.items.map((item) => (
                        <li key={item.label} className="flex items-center gap-3 text-sm">
                          <span className={item.ok ? 'text-green-500' : 'text-red-400'}>{item.ok ? '✅' : '❌'}</span>
                          <span className="text-stone-700">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-stone-500 bg-white border border-stone-200 rounded-lg p-3 leading-relaxed">
                      {section.note}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* SELLER TAB */}
            {activeTab === 'seller' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl font-bold text-amber-700">
                      {mockProduct.seller.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">{mockProduct.seller.name}</h3>
                      <div className="flex items-center gap-2">
                        {mockProduct.seller.verified && (
                          <span className="text-xs text-green-700 bg-green-100 border border-green-200 font-semibold px-2 py-0.5 rounded-full">
                            ✅ Verified Seller
                          </span>
                        )}
                        <span className="text-xs text-stone-500">{mockProduct.seller.region} Region</span>
                      </div>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Rating', `⭐ ${mockProduct.seller.rating}/5.0`],
                        ['Total Sales', `${mockProduct.seller.totalSales}+ orders`],
                        ['Member Since', mockProduct.seller.memberSince],
                        ['FLEGT License', mockProduct.seller.flegtLicenseNumber],
                      ].map(([k, v]) => (
                        <tr key={k} className="border-b border-stone-100">
                          <td className="py-2.5 text-stone-500 font-medium w-36">{k}</td>
                          <td className="py-2.5 text-stone-900 font-semibold">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                  <h4 className="font-bold text-stone-800 mb-4">Contact Seller</h4>
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      placeholder="Write your enquiry or request for quote..."
                      className="w-full border border-stone-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition-all">
                      Send Enquiry
                    </button>
                    <p className="text-xs text-stone-400 text-center">
                      Average response time: &lt;4 hours
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {mockProduct.relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/catalog/${p.id}`}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="h-40 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center text-5xl">
                  🪵
                </div>
                <div className="p-4">
                  <div className="text-xs text-amber-700 font-semibold mb-1">{p.category}</div>
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{p.name}</h3>
                  <p className="text-xs text-stone-500 italic mb-2">{p.species}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">GHS {p.price.toLocaleString()}/m³</span>
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                      {p.score}% 🌱
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
