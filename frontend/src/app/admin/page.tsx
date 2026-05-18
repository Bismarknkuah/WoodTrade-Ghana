'use client';

import { useState } from 'react';
import Link from 'next/link';


// ─── Regional Admin Data ────────────────────────────────────────────────────
const REGIONAL_ADMINS = [
  { id: 'RA01', name: 'Dr. Kwame Mensah', region: 'Greater Accra', email: 'accra@woodtrade.gh', phone: '024XXXXXXX', status: 'active', sellers: 142, pendingLicenses: 8, monthlyRevenue: 'GHS 820K' },
  { id: 'RA02', name: 'Nana Osei Bonsu', region: 'Ashanti', email: 'ashanti@woodtrade.gh', phone: '025XXXXXXX', status: 'active', sellers: 98, pendingLicenses: 5, monthlyRevenue: 'GHS 640K' },
  { id: 'RA03', name: 'Ama Dzisi', region: 'Volta', email: 'volta@woodtrade.gh', phone: '026XXXXXXX', status: 'active', sellers: 44, pendingLicenses: 2, monthlyRevenue: 'GHS 180K' },
  { id: 'RA04', name: 'Kofi Brempong', region: 'Eastern', email: 'eastern@woodtrade.gh', phone: '027XXXXXXX', status: 'active', sellers: 57, pendingLicenses: 3, monthlyRevenue: 'GHS 240K' },
  { id: 'RA05', name: 'Abena Sarfo', region: 'Western', email: 'western@woodtrade.gh', phone: '028XXXXXXX', status: 'active', sellers: 63, pendingLicenses: 4, monthlyRevenue: 'GHS 310K' },
  { id: 'RA06', name: 'Yaw Antwi', region: 'Central', email: 'central@woodtrade.gh', phone: '029XXXXXXX', status: 'active', sellers: 39, pendingLicenses: 1, monthlyRevenue: 'GHS 160K' },
  { id: 'RA07', name: 'Akosua Frimpong', region: 'Brong-Ahafo / Bono', email: 'bono@woodtrade.gh', phone: '020XXXXXXX', status: 'active', sellers: 51, pendingLicenses: 3, monthlyRevenue: 'GHS 210K' },
  { id: 'RA08', name: 'Kweku Asante', region: 'Northern', email: 'northern@woodtrade.gh', phone: '024XXXXXXX', status: 'active', sellers: 28, pendingLicenses: 2, monthlyRevenue: 'GHS 95K' },
  { id: 'RA09', name: 'Fatima Al-Hassan', region: 'Upper East', email: 'uppereast@woodtrade.gh', phone: '055XXXXXXX', status: 'active', sellers: 18, pendingLicenses: 1, monthlyRevenue: 'GHS 62K' },
  { id: 'RA10', name: 'Ibrahim Seidu', region: 'Upper West', email: 'upperwest@woodtrade.gh', phone: '054XXXXXXX', status: 'active', sellers: 14, pendingLicenses: 0, monthlyRevenue: 'GHS 48K' },
  { id: 'RA11', name: 'Efua Mensah', region: 'Western North', email: 'westnorth@woodtrade.gh', phone: '059XXXXXXX', status: 'active', sellers: 31, pendingLicenses: 2, monthlyRevenue: 'GHS 130K' },
  { id: 'RA12', name: 'Nana Ama Boateng', region: 'Ahafo', email: 'ahafo@woodtrade.gh', phone: '050XXXXXXX', status: 'active', sellers: 22, pendingLicenses: 1, monthlyRevenue: 'GHS 88K' },
  { id: 'RA13', name: 'Kojo Tetteh', region: 'Bono East', email: 'bonoeast@woodtrade.gh', phone: '024XXXXXXX', status: 'active', sellers: 19, pendingLicenses: 1, monthlyRevenue: 'GHS 76K' },
  { id: 'RA14', name: 'Akwasi Owusu', region: 'Oti', email: 'oti@woodtrade.gh', phone: '055XXXXXXX', status: 'active', sellers: 12, pendingLicenses: 0, monthlyRevenue: 'GHS 42K' },
  { id: 'RA15', name: 'Mariama Alhassan', region: 'Savannah', email: 'savannah@woodtrade.gh', phone: '024XXXXXXX', status: 'active', sellers: 16, pendingLicenses: 1, monthlyRevenue: 'GHS 55K' },
  { id: 'RA16', name: 'Prosper Nyarko', region: 'North East', email: 'northeast@woodtrade.gh', phone: '026XXXXXXX', status: 'active', sellers: 11, pendingLicenses: 0, monthlyRevenue: 'GHS 38K' },
  { id: 'IA01', name: 'Prof. Emmanuel Asante', region: 'International Markets', email: 'international@woodtrade.gh', phone: '0240715156', status: 'active', sellers: 312, pendingLicenses: 15, monthlyRevenue: 'USD 285K' },
];

// ─── Promotions Data ────────────────────────────────────────────────────────
const PROMOTIONS = [
  { id: 'P001', code: 'FIRSTBUY', title: 'First-Time Buyer', discount: '15%', type: 'percentage', region: 'All Regions', category: 'All', validUntil: '2026-06-30', createdBy: 'Super Admin', usageLeft: 487, status: 'active' },
  { id: 'P002', code: 'ASHANTI20', title: 'Ashanti Special', discount: '20%', type: 'percentage', region: 'Ashanti', category: 'Timber', validUntil: '2026-05-31', createdBy: 'Ashanti Regional Admin', usageLeft: 120, status: 'active' },
  { id: 'P003', code: 'MOMO5', title: 'MoMo Cashback', discount: 'GHS 5', type: 'fixed', region: 'All', category: 'All', validUntil: '2026-12-31', createdBy: 'International Admin', usageLeft: 999, status: 'active' },
  { id: 'P004', code: 'EXPORT10', title: 'Export Orders', discount: '10%', type: 'percentage', region: 'International', category: 'Export', validUntil: '2026-06-15', createdBy: 'International Admin', usageLeft: 45, status: 'active' },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Total Users', value: '2,841', change: '+12%', icon: '👥', color: 'blue' },
  { label: 'Active Sellers', value: '487', change: '+8%', icon: '🏪', color: 'amber' },
  { label: 'Pending Approvals', value: '23', change: '!', icon: '⏳', color: 'red' },
  { label: 'Orders This Month', value: '1,204', change: '+21%', icon: '📦', color: 'green' },
  { label: 'Revenue (GHS)', value: '4.2M', change: '+18%', icon: '💰', color: 'green' },
  { label: 'Compliance Rate', value: '94.2%', change: '+2.1%', icon: '✅', color: 'emerald' },
];

const pendingLicenses = [
  { id: 'L001', seller: 'KumaSaw Ltd.', type: 'FLEGT License', submitted: '2025-01-10', status: 'pending', region: 'Ashanti' },
  { id: 'L002', seller: 'GreenForest Exporters', type: 'Tax Clearance', submitted: '2025-01-11', status: 'pending', region: 'Greater Accra' },
  { id: 'L003', seller: 'Volta Timber Co.', type: 'Business Registration', submitted: '2025-01-12', status: 'pending', region: 'Volta' },
  { id: 'L004', seller: 'Accra Bamboo Supplies', type: 'TIDD Permit', submitted: '2025-01-13', status: 'pending', region: 'Greater Accra' },
  { id: 'L005', seller: 'Northern Woods Ltd.', type: 'Forestry Commission Cert.', submitted: '2025-01-14', status: 'pending', region: 'Northern' },
];

const recentOrders = [
  { id: 'WTG-ORD-00000001', buyer: 'Timber USA Inc.', seller: 'Ashanti Forest Products', amount: 'GHS 84,000', destination: 'USA', laceyAct: true, status: 'Processing' },
  { id: 'WTG-ORD-00000002', buyer: 'EuroWood GmbH', seller: 'KumaSaw Ltd.', amount: 'GHS 126,000', destination: 'Germany', eudr: true, status: 'Shipped' },
  { id: 'WTG-ORD-00000003', buyer: 'Accra Builders Co.', seller: 'Volta Timber Co.', amount: 'GHS 22,400', destination: 'Local', status: 'Delivered' },
  { id: 'WTG-ORD-00000004', buyer: 'Nordic Timber AS', seller: 'GreenForest Exporters', amount: 'GHS 210,000', destination: 'Norway', eudr: true, status: 'Pending' },
];

const flaggedProducts = [
  { id: 'P101', name: 'Grade C Mahogany', seller: 'Unknown Sawmill', reason: 'No FLEGT license attached', severity: 'high' },
  { id: 'P102', name: 'Bamboo Poles Bulk', seller: 'Quick Export Ltd.', reason: 'Sustainability score below threshold (42)', severity: 'medium' },
  { id: 'P103', name: 'Mixed Hardwood Lot', seller: 'Coastal Traders', reason: 'Species not declared', severity: 'high' },
];

const users = [
  { id: 'U001', name: 'Kofi Asante', role: 'Seller', region: 'Ashanti', status: 'active', joined: '2024-03-10', sales: 142 },
  { id: 'U002', name: 'Ama Owusu', role: 'Manufacturer', region: 'Greater Accra', status: 'pending', joined: '2025-01-08', sales: 0 },
  { id: 'U003', name: 'John Smith', role: 'Buyer', region: 'USA', status: 'active', joined: '2024-07-22', sales: 0 },
  { id: 'U004', name: 'Volta Exports Ltd.', role: 'Reseller', region: 'Volta', status: 'suspended', joined: '2023-11-01', sales: 31 },
];

type Tab = 'overview' | 'licenses' | 'orders' | 'products' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [licenseStatuses, setLicenseStatuses] = useState<Record<string, string>>({});
  const [productStatuses, setProductStatuses] = useState<Record<string, string>>({});
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  const approveLicense = (id: string) =>
    setLicenseStatuses((s) => ({ ...s, [id]: 'approved' }));
  const rejectLicense = (id: string) =>
    setLicenseStatuses((s) => ({ ...s, [id]: 'rejected' }));

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'licenses', label: '📋 License Approvals', badge: pendingLicenses.length },
    { key: 'orders', label: '📦 Orders' },
    { key: 'products', label: '⚠️ Flagged Products', badge: flaggedProducts.length },
    { key: 'users', label: '👥 Users' },
  ];

  const statusColor: Record<string, string> = {
    Processing: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-amber-100 text-amber-700',
    Delivered: 'bg-green-100 text-green-700',
    Pending: 'bg-stone-100 text-stone-600',
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Admin Header */}
      <header className="bg-[#3d2210] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              WoodTrade
            </Link>
            <span className="text-stone-400">|</span>
            <span className="text-amber-400 font-semibold text-sm">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="font-semibold">Admin User</div>
              <div className="text-stone-400 text-xs">Super Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold">A</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Nav */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#5a3e2b] text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-amber-400 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      s.change === '!' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {s.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">{s.value}</div>
                  <div className="text-sm text-stone-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Lacey Act', compliant: 98, total: 104, color: 'blue', flag: '🇺🇸' },
                { title: 'EUDR', compliant: 71, total: 78, color: 'amber', flag: '🇪🇺' },
                { title: 'FLEGT', compliant: 412, total: 487, color: 'green', flag: '🇬🇭' },
              ].map((c) => {
                const pct = Math.round((c.compliant / c.total) * 100);
                return (
                  <div key={c.title} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{c.flag}</span>
                      <h3 className="font-bold text-stone-800">{c.title} Compliance</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold text-stone-900">{pct}%</span>
                      <span className="text-stone-500 text-sm mb-1">{c.compliant}/{c.total} orders</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-${c.color}-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200">
                <h2 className="font-bold text-stone-800 text-lg">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50">
                    <tr>
                      {['Order ID', 'Buyer', 'Seller', 'Amount', 'Dest.', 'Compliance', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-stone-500 font-semibold text-xs uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-stone-100 hover:bg-stone-50">
                        <td className="px-4 py-3 font-mono text-xs text-stone-600">{o.id}</td>
                        <td className="px-4 py-3 font-medium text-stone-900">{o.buyer}</td>
                        <td className="px-4 py-3 text-stone-600">{o.seller}</td>
                        <td className="px-4 py-3 font-semibold text-stone-900">{o.amount}</td>
                        <td className="px-4 py-3 text-stone-600">{o.destination}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {o.laceyAct && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">Lacey</span>}
                            {o.eudr && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">EUDR</span>}
                            {!o.laceyAct && !o.eudr && <span className="text-xs text-stone-400">—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── LICENSE APPROVALS ── */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-stone-800">Pending License Approvals</h2>
              <span className="text-sm text-stone-500">{pendingLicenses.filter((l) => !licenseStatuses[l.id]).length} remaining</span>
            </div>
            {pendingLicenses.map((lic) => {
              const status = licenseStatuses[lic.id];
              return (
                <div
                  key={lic.id}
                  className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
                    status === 'approved'
                      ? 'border-green-300 bg-green-50'
                      : status === 'rejected'
                      ? 'border-red-300 bg-red-50 opacity-60'
                      : 'border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-stone-900 text-lg">{lic.seller}</h3>
                        <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 font-semibold px-2.5 py-1 rounded-full">
                          {lic.type}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-stone-500">
                        <span>📍 {lic.region}</span>
                        <span>📅 Submitted: {lic.submitted}</span>
                        <span>🆔 {lic.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-4">
                      {status ? (
                        <span
                          className={`font-bold px-4 py-2 rounded-lg text-sm ${
                            status === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                        </span>
                      ) : (
                        <>
                          <button className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold rounded-lg transition-all">
                            📄 View Doc
                          </button>
                          <button
                            onClick={() => rejectLicense(lic.id)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 text-sm font-semibold rounded-lg transition-all"
                          >
                            ✗ Reject
                          </button>
                          <button
                            onClick={() => approveLicense(lic.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all shadow"
                          >
                            ✓ Approve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-bold text-stone-800 text-lg">All Orders</h2>
              <button className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-all">
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50">
                  <tr>
                    {['Order ID', 'Buyer', 'Seller', 'Amount', 'Destination', 'Compliance', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-stone-500 font-semibold text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-stone-100 hover:bg-stone-50">
                      <td className="px-4 py-3 font-mono text-xs text-stone-600">{o.id}</td>
                      <td className="px-4 py-3 font-medium text-stone-900">{o.buyer}</td>
                      <td className="px-4 py-3 text-stone-600">{o.seller}</td>
                      <td className="px-4 py-3 font-semibold">{o.amount}</td>
                      <td className="px-4 py-3">{o.destination}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {o.laceyAct && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">Lacey</span>}
                          {o.eudr && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">EUDR</span>}
                          {!o.laceyAct && !o.eudr && '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FLAGGED PRODUCTS ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-stone-800">Flagged Products</h2>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full">
                {flaggedProducts.filter((p) => !productStatuses[p.id]).length} active flags
              </span>
            </div>
            {flaggedProducts.map((p) => {
              const resolved = productStatuses[p.id];
              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-xl p-6 shadow-sm ${
                    resolved ? 'border-stone-200 opacity-50' : p.severity === 'high' ? 'border-red-300' : 'border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {p.severity.toUpperCase()} RISK
                        </span>
                        <h3 className="font-bold text-stone-900">{p.name}</h3>
                        <span className="text-xs text-stone-400 font-mono">{p.id}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-1">Seller: {p.seller}</p>
                      <p className="text-sm text-red-600 font-medium">⚠ {p.reason}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {resolved ? (
                        <span className="text-sm font-semibold text-stone-500 bg-stone-100 px-3 py-2 rounded-lg">
                          {resolved}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => setProductStatuses((s) => ({ ...s, [p.id]: '✅ Approved' }))}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setProductStatuses((s) => ({ ...s, [p.id]: '🚫 Removed' }))}
                            className="px-3 py-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 text-sm font-semibold rounded-lg transition-all"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-bold text-stone-800 text-lg">Platform Users</h2>
              <input
                type="text"
                placeholder="Search users..."
                className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <table className="w-full text-sm">
              <thead className="bg-stone-50">
                <tr>
                  {['ID', 'Name', 'Role', 'Region', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-stone-500 font-semibold text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const currentStatus = userStatuses[u.id] || u.status;
                  return (
                    <tr key={u.id} className="border-t border-stone-100 hover:bg-stone-50">
                      <td className="px-4 py-3 font-mono text-xs text-stone-400">{u.id}</td>
                      <td className="px-4 py-3 font-semibold text-stone-900">{u.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600">{u.region}</td>
                      <td className="px-4 py-3 text-stone-500">{u.joined}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          currentStatus === 'active' ? 'bg-green-100 text-green-700' :
                          currentStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {currentStatus !== 'suspended' ? (
                            <button
                              onClick={() => setUserStatuses((s) => ({ ...s, [u.id]: 'suspended' }))}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => setUserStatuses((s) => ({ ...s, [u.id]: 'active' }))}
                              className="text-xs text-green-600 hover:text-green-800 font-semibold underline"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
