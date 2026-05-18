'use client';
import { useState } from 'react';
import Link from 'next/link';
import { GHANA_REGIONS, getDistrictNames } from '../../lib/ghanaRegions';

const TABS = ['Overview', 'My Products', 'Orders', 'Licenses', 'Compliance', 'Analytics'];

const MOCK_STATS = {
  totalRevenue: 48750,
  monthlyRevenue: 12400,
  activeListings: 14,
  pendingOrders: 7,
  totalOrders: 83,
  exportOrders: 41,
  sustainabilityScore: 84,
  viewsThisMonth: 2340,
};

const MOCK_ORDERS = [
  { id: 'WTG-ORD-8932401', buyer: 'Timber Solutions Inc.', country: '🇺🇸 USA', amount: 18500, status: 'shipped', date: '2026-01-15', laceyReady: true },
  { id: 'WTG-ORD-8932388', buyer: 'EuroWood GmbH', country: '🇩🇪 Germany', amount: 24000, status: 'customs_clearance', date: '2026-01-12', laceyReady: false },
  { id: 'WTG-ORD-8932371', buyer: 'BuildRight Ltd.', country: '🇬🇭 Ghana', amount: 4200, status: 'delivered', date: '2026-01-08', laceyReady: false },
  { id: 'WTG-ORD-8932360', buyer: 'Pacific Lumber Co.', country: '🇺🇸 USA', amount: 31200, status: 'processing', date: '2026-01-18', laceyReady: true },
  { id: 'WTG-ORD-8932349', buyer: 'Nordic Timber AS', country: '🇸🇪 Sweden', amount: 9800, status: 'confirmed', date: '2026-01-19', laceyReady: false },
];

const MOCK_PRODUCTS = [
  { id: '1', title: 'Prime Odum Timber', status: 'active', views: 412, inquiries: 18, price: 1850, stock: 240, unit: 'm³' },
  { id: '2', title: 'Wawa Lumber — Kiln Dried', status: 'active', views: 298, inquiries: 11, price: 920, stock: 380, unit: 'm³' },
  { id: '3', title: 'African Mahogany Grade A', status: 'active', views: 531, inquiries: 24, price: 2400, stock: 120, unit: 'm³' },
  { id: '4', title: 'Marine Plywood 18mm', status: 'pending_review', views: 0, inquiries: 0, price: 680, stock: 200, unit: 'sheet' },
];

const MOCK_LICENSES = [
  { type: 'TIDD License', number: 'TIDD-2024-08923', issuedBy: 'Timber Industry Development Division', expiry: '2026-12-31', status: 'approved' },
  { type: 'Forestry Commission', number: 'FC-GH-2024-4421', issuedBy: 'Forestry Commission of Ghana', expiry: '2027-03-15', status: 'approved' },
  { type: 'Business Registration', number: 'BN-GH-987654', issuedBy: 'Registrar General Dept.', expiry: '2026-08-30', status: 'approved' },
  { type: 'Export License', number: 'EXP-GH-2024-1190', issuedBy: 'GEPC', expiry: '2025-12-01', status: 'expired' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending_review: 'bg-amber-100 text-amber-800',
  shipped: 'bg-blue-100 text-blue-800',
  customs_clearance: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  processing: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-teal-100 text-teal-800',
  approved: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  pending: 'bg-amber-100 text-amber-800',
};

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className={`text-2xl mb-3`}>{icon}</div>
      <div className={`text-2xl font-bold ${color || 'text-stone-900'}`}>{value}</div>
      <div className="text-sm font-medium text-stone-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Dashboard Header */}
      <div className="bg-[#5a3e2b] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-serif">Seller Dashboard</h1>
            <p className="text-amber-200 text-sm mt-1">Asante Timber Co. • ✅ Verified Seller</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              🌿 Sustainability: 84/100
            </span>
            <button onClick={() => setShowAddProduct(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">+ List Product</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== OVERVIEW ===== */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <StatCard icon="💰" label="Total Revenue" value={`$${MOCK_STATS.totalRevenue.toLocaleString()}`} sub="All time" color="text-green-700" />
              <StatCard icon="📈" label="This Month" value={`$${MOCK_STATS.monthlyRevenue.toLocaleString()}`} sub="Jan 2026" color="text-amber-700" />
              <StatCard icon="📦" label="Active Listings" value={MOCK_STATS.activeListings} sub={`${MOCK_STATS.pendingOrders} pending review`} />
              <StatCard icon="🚢" label="Export Orders" value={MOCK_STATS.exportOrders} sub={`of ${MOCK_STATS.totalOrders} total`} color="text-blue-700" />
            </div>

            {/* Alerts */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800 text-sm">License Expiry Alert</p>
                <p className="text-red-600 text-sm">Your Export License (EXP-GH-2024-1190) expired on Dec 1, 2025. Renew it to continue exporting.</p>
                <button
                  onClick={() => setActiveTab('Licenses')}
                  className="text-red-700 underline text-sm mt-1 font-medium"
                >
                  Manage Licenses →
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-stone-900 text-lg">Recent Orders</h2>
                <button onClick={() => setActiveTab('Orders')} className="text-amber-600 text-sm hover:underline">View all</button>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      {['Order #', 'Buyer', 'Destination', 'Amount', 'Status', 'Lacey Act'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {MOCK_ORDERS.slice(0, 3).map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-amber-700">{o.id}</td>
                        <td className="px-4 py-3 font-medium text-stone-900">{o.buyer}</td>
                        <td className="px-4 py-3 text-stone-500">{o.country}</td>
                        <td className="px-4 py-3 font-bold text-stone-900">${o.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[o.status]}`}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {o.laceyReady
                            ? <span className="text-green-600 text-xs font-semibold">✓ Ready</span>
                            : <span className="text-amber-600 text-xs font-semibold">⚠ Needed</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== MY PRODUCTS ===== */}
        {activeTab === 'My Products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-stone-900 text-xl">My Product Listings</h2>
              <Link href="/catalog/new" className="btn-primary text-sm">+ Add Product</Link>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {['Product', 'Status', 'Price', 'Stock', 'Views', 'Inquiries', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {MOCK_PRODUCTS.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-stone-900">{p.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-amber-700">${p.price} / {p.unit}</td>
                      <td className="px-4 py-4 text-stone-700">{p.stock} {p.unit}</td>
                      <td className="px-4 py-4 text-stone-500">{p.views}</td>
                      <td className="px-4 py-4 text-stone-500">{p.inquiries}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link href={`/catalog/${p.id}/edit`} className="text-amber-600 hover:underline text-xs font-medium">Edit</Link>
                          <Link href={`/catalog/${p.id}`} className="text-stone-500 hover:underline text-xs font-medium">View</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === 'Orders' && (
          <div>
            <h2 className="font-bold text-stone-900 text-xl mb-6">All Orders</h2>
            <div className="space-y-4">
              {MOCK_ORDERS.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-stone-200 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs text-amber-700 mb-1">{o.id}</p>
                      <p className="font-bold text-stone-900 text-base">{o.buyer}</p>
                      <p className="text-stone-500 text-sm">{o.country} • {o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-stone-900">${o.amount.toLocaleString()}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[o.status]}`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  {o.laceyReady && (
                    <div className="mt-3 flex gap-3">
                      <Link
                        href={`/api/export/lacey-act/${o.id}`}
                        className="text-sm bg-blue-50 text-blue-700 border border-blue-200 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        📄 Download Lacey Act
                      </Link>
                      <Link
                        href={`/api/export/commercial-invoice/${o.id}`}
                        className="text-sm bg-stone-50 text-stone-700 border border-stone-200 font-medium px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                      >
                        🧾 Commercial Invoice
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== LICENSES ===== */}
        {activeTab === 'Licenses' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-stone-900 text-xl">License Management</h2>
              <button
                onClick={() => setShowAddLicense(true)}
                className="btn-primary text-sm"
              >
                + Upload License
              </button>
            </div>

            <div className="grid gap-4">
              {MOCK_LICENSES.map((lic) => {
                const expDate = new Date(lic.expiry);
                const daysLeft = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isExpired = daysLeft < 0;
                const isWarning = daysLeft >= 0 && daysLeft <= 60;

                return (
                  <div
                    key={lic.number}
                    className={`bg-white rounded-2xl border-2 p-5 ${
                      isExpired ? 'border-red-300' : isWarning ? 'border-amber-300' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-stone-900">{lic.type}</h3>
                        <p className="text-stone-500 text-sm">#{lic.number}</p>
                        <p className="text-stone-500 text-sm">Issued by: {lic.issuedBy}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[lic.status]}`}>
                          {lic.status}
                        </span>
                        <p className={`text-sm font-semibold mt-2 ${isExpired ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-stone-600'}`}>
                          {isExpired ? `⚠ Expired ${Math.abs(daysLeft)}d ago` : `Valid until ${lic.expiry} (${daysLeft}d left)`}
                        </p>
                      </div>
                    </div>
                    {isExpired && (
                      <button className="mt-3 text-sm bg-red-50 text-red-700 border border-red-200 font-medium px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        🔄 Upload Renewal
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add License Modal */}
            {showAddLicense && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                  <h3 className="font-bold text-stone-900 text-lg mb-4">Upload New License</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">License Type</label>
                      <select className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                        <option>TIDD License</option>
                        <option>Forestry Commission</option>
                        <option>Business Registration</option>
                        <option>Export License (GEPC)</option>
                        <option>Tax Clearance Certificate</option>
                        <option>FLEGT License</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">License Number</label>
                      <input type="text" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. TIDD-2026-XXXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-stone-700 block mb-1">Issue Date</label>
                        <input type="date" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-700 block mb-1">Expiry Date</label>
                        <input type="date" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 block mb-1">Upload Document (PDF)</label>
                      <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center text-stone-400 text-sm cursor-pointer hover:border-amber-400 transition-colors">
                        📎 Click to upload or drag & drop
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button className="btn-primary flex-1 text-sm" onClick={() => setShowAddLicense(false)}>Submit for Review</button>
                    <button className="flex-1 border border-stone-300 text-stone-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-stone-50 transition-colors" onClick={() => setShowAddLicense(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== COMPLIANCE ===== */}
        {activeTab === 'Compliance' && (
          <div>
            <h2 className="font-bold text-stone-900 text-xl mb-6">Export Compliance Center</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-bold text-stone-900 mb-4">🇺🇸 USA — Lacey Act</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Scientific name (genus/species)', done: true },
                    { label: 'Country of harvest', done: true },
                    { label: 'Quantity and unit of measure', done: true },
                    { label: 'Value of imported goods', done: true },
                    { label: 'APHIS PPQ 505 form', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className={`text-lg ${item.done ? 'text-green-500' : 'text-stone-300'}`}>
                        {item.done ? '✅' : '○'}
                      </span>
                      <span className={item.done ? 'text-stone-700' : 'text-stone-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-5 w-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold py-2.5 rounded-xl text-sm hover:bg-blue-100 transition-colors">
                  Generate Lacey Act Declaration
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-bold text-stone-900 mb-4">🇪🇺 Europe — EUDR</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Due diligence statement uploaded', done: true },
                    { label: 'GPS coordinates of harvest location', done: true },
                    { label: 'Forest risk assessment complete', done: false },
                    { label: 'Supply chain documentation', done: false },
                    { label: 'Operator registration in EU system', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className={`text-lg ${item.done ? 'text-green-500' : 'text-stone-300'}`}>
                        {item.done ? '✅' : '○'}
                      </span>
                      <span className={item.done ? 'text-stone-700' : 'text-stone-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-5 w-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold py-2.5 rounded-xl text-sm hover:bg-amber-100 transition-colors">
                  Complete EUDR Setup
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-bold text-stone-900 mb-4">🌲 Ghana — FLEGT</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'TIDD License (valid)', done: true },
                    { label: 'Forestry Commission permit', done: true },
                    { label: 'Chain of Custody records', done: true },
                    { label: 'FLEGT License applied', done: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className={`text-lg ${item.done ? 'text-green-500' : 'text-stone-300'}`}>
                        {item.done ? '✅' : '○'}
                      </span>
                      <span className={item.done ? 'text-stone-700' : 'text-stone-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h3 className="font-bold text-stone-900 mb-4">📊 Sustainability Score</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="#22c55e" strokeWidth="3"
                        strokeDasharray={`${84} ${100 - 84}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-stone-900">84</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-green-700 font-semibold">✓ FSC Compliant practices</p>
                    <p className="text-green-700">✓ Legal sourcing verified</p>
                    <p className="text-amber-600">⚠ Reforestation program needed</p>
                    <p className="text-amber-600">⚠ Carbon offset not enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ANALYTICS ===== */}
        {activeTab === 'Analytics' && (
          <div>
            <h2 className="font-bold text-stone-900 text-xl mb-6">Analytics</h2>
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              <StatCard icon="👁️" label="Product Views (Jan)" value="2,340" sub="+18% vs last month" color="text-blue-700" />
              <StatCard icon="💬" label="Inquiries" value="89" sub="12 this week" color="text-purple-700" />
              <StatCard icon="🔄" label="Conversion Rate" value="4.2%" sub="Inquiries → Orders" color="text-green-700" />
            </div>

            {/* Revenue by destination */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h3 className="font-bold text-stone-900 mb-5">Revenue by Destination</h3>
              <div className="space-y-3">
                {[
                  { country: '🇺🇸 USA', pct: 52, amount: 25350 },
                  { country: '🇩🇪 Germany', pct: 23, amount: 11213 },
                  { country: '🇬🇧 UK', pct: 15, amount: 7313 },
                  { country: '🇬🇭 Ghana (Local)', pct: 10, amount: 4875 },
                ].map((d) => (
                  <div key={d.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-stone-700">{d.country}</span>
                      <span className="text-stone-500">${d.amount.toLocaleString()} ({d.pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
    </div>
  );
}

// ─── Add Product Modal Component ──────────────────────────────────────────────
export function AddProductModal({ onClose }: { onClose: () => void }) {
  const WOOD_CATEGORIES = ['Timber', 'Bamboo', 'Plywood', 'Engineered Wood', 'Veneer', 'Charcoal', 'Other'];
  const [form, setForm] = useState({
    name: '', species: '', category: 'Timber', description: '',
    price: '', currency: 'GHS', unit: 'per cubic metre',
    minOrder: '1', stock: '', region: '', district: '',
    harvestLocation: '', grading: '', moisture: '',
    flegtVerified: false, fscCertified: false,
    laceyActCompliant: false, eudrCompliant: false,
    exportMarkets: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: any) => setForm(prev => {
    const next = { ...prev, [field]: value };
    if (field === 'region') next.district = '';
    return next;
  });

  const districts = getDistrictNames(form.region);

  const toggleMarket = (market: string) => {
    setForm(prev => ({
      ...prev,
      exportMarkets: prev.exportMarkets.includes(market)
        ? prev.exportMarkets.filter(m => m !== market)
        : [...prev.exportMarkets, market],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    setLoading(false);
    setTimeout(onClose, 2000);
  };

  const inputCls = 'w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white';
  const selectCls = 'w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#5a3e2b] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-bold text-lg">🪵 List New Product</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        {success ? (
          <div className="p-10 text-center">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="font-bold text-stone-900 text-xl mb-2">Product Listed!</h3>
            <p className="text-stone-500 text-sm">Your product has been submitted for admin review.</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3 pb-2 border-b border-stone-100">📋 Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Premium Odum Timber" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => update('category', e.target.value)} className={selectCls}>
                    {WOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Species / Scientific Name</label>
                  <input value={form.species} onChange={e => update('species', e.target.value)} placeholder="e.g. Milicia excelsa" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Description *</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                    placeholder="Describe your product — grade, quality, typical uses..." className={inputCls + ' resize-none'} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3 pb-2 border-b border-stone-100">💰 Pricing & Stock</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Price *</label>
                  <div className="flex gap-2">
                    <select value={form.currency} onChange={e => update('currency', e.target.value)} className="border border-stone-300 rounded-lg px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                      <option>GHS</option>
                      <option>USD</option>
                    </select>
                    <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0.00" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Unit</label>
                  <select value={form.unit} onChange={e => update('unit', e.target.value)} className={selectCls}>
                    {['per cubic metre', 'per board foot', 'per sheet', 'per pole', 'per ton', 'per piece'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Minimum Order Qty *</label>
                  <input type="number" value={form.minOrder} onChange={e => update('minOrder', e.target.value)} placeholder="1" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Available Stock *</label>
                  <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} placeholder="e.g. 500" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3 pb-2 border-b border-stone-100">📍 Harvest Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Region *</label>
                  <div className="relative">
                    <select value={form.region} onChange={e => update('region', e.target.value)} className={selectCls}>
                      <option value="">— Select Region —</option>
                      {GHANA_REGIONS.map(r => <option key={r.code} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">
                    District {form.region && `(${districts.length} in ${form.region})`}
                  </label>
                  <select value={form.district} onChange={e => update('district', e.target.value)} className={selectCls} disabled={!form.region}>
                    <option value="">{form.region ? `— Select District —` : '— Select region first —'}</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Specific Harvest Location (GPS/Description)</label>
                  <input value={form.harvestLocation} onChange={e => update('harvestLocation', e.target.value)}
                    placeholder="e.g. Offinso North Forest Reserve, 6.4°N 1.9°W" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Quality */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3 pb-2 border-b border-stone-100">⭐ Quality Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Grading</label>
                  <select value={form.grading} onChange={e => update('grading', e.target.value)} className={selectCls}>
                    <option value="">— Select Grade —</option>
                    {['Grade A (Select)', 'Grade B (Common)', 'Grade C', 'FAS (Firsts & Seconds)', 'No. 1 Common', 'No. 2 Common'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Moisture Content</label>
                  <select value={form.moisture} onChange={e => update('moisture', e.target.value)} className={selectCls}>
                    <option value="">— Select —</option>
                    {['Air Dried (18-22%)', 'Kiln Dried (6-12%)', 'Green (>30%)', '12-15%', '8-12%'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3 pb-2 border-b border-stone-100">📋 Compliance & Certifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { field: 'flegtVerified', label: '🇬🇭 FLEGT Verified', desc: 'Ghana Forestry Commission' },
                  { field: 'fscCertified', label: '🌿 FSC Certified', desc: 'Forest Stewardship Council' },
                  { field: 'laceyActCompliant', label: '🇺🇸 Lacey Act Ready', desc: 'For USA export' },
                  { field: 'eudrCompliant', label: '🇪🇺 EUDR Compliant', desc: 'For EU export' },
                ].map(c => (
                  <label key={c.field} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${(form as any)[c.field] ? 'border-green-400 bg-green-50' : 'border-stone-200 hover:border-stone-300'}`}>
                    <input type="checkbox" checked={(form as any)[c.field]} onChange={e => update(c.field, e.target.checked)} className="accent-green-500 w-4 h-4" />
                    <div>
                      <div className="text-sm font-semibold text-stone-800">{c.label}</div>
                      <div className="text-xs text-stone-500">{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Export Markets */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-stone-600 block mb-2">Target Export Markets</label>
                <div className="flex flex-wrap gap-2">
                  {['🇬🇭 Ghana (Local)', '🇺🇸 USA', '🇪🇺 Europe', '🇬🇧 UK', '🇨🇳 China', '🇮🇳 India', '🇸🇦 Middle East', '🌍 Other Africa'].map(market => (
                    <button key={market} type="button" onClick={() => toggleMarket(market)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${form.exportMarkets.includes(market) ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-stone-300 text-stone-600 hover:border-amber-300'}`}>
                      {market}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-stone-100">
              <button onClick={onClose} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  </span>
                ) : '🪵 Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
