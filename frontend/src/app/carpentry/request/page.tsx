'use client';
import { useState } from 'react';
import Link from 'next/link';
import { GHANA_REGIONS, getDistrictNames } from '../../../lib/ghanaRegions';

const CATEGORIES = ['Furniture', 'Doors & Windows', 'Kitchen Cabinets', 'Wardrobes', 'Office Furniture', 'Outdoor Furniture', 'Staircase', 'Full Fit-out', 'Other'];
const WOOD_TYPES = ['Any / Carpenter\'s Choice', 'Mahogany (Luxury)', 'Odum / Iroko (Durable)', 'Teak (Outdoor)', 'Wawa (Lightweight)', 'Sapele (Mid-range)', 'MDF (Budget)', 'Plywood + Veneer'];
const FINISHES = ['Any', 'Lacquer / High Gloss', 'Matte Paint', 'Varnish', 'Oil Finish (Natural)', 'PVC Wrapped', 'Laminate', 'Wax Polish'];
const BUDGETS = ['Under GHS 1,000', 'GHS 1,000 – 3,000', 'GHS 3,000 – 8,000', 'GHS 8,000 – 20,000', 'Above GHS 20,000', 'Flexible / Open to Quotes'];
const TIMELINES = ['ASAP (Urgent)', '1–2 Weeks', '3–4 Weeks', '1–2 Months', 'No Rush'];

export default function CustomRequestPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    category: '', description: '', dimensions: '', woodType: 'Any / Carpenter\'s Choice',
    finish: 'Any', budget: '', timeline: '', region: '', district: '',
    fullName: '', phone: '', email: '', deliveryAddress: '',
    images: [] as string[], isLoggedIn: false,
  });

  const update = (field: string, value: any) => setForm(prev => {
    const next = { ...prev, [field]: value };
    if (field === 'region') next.district = '';
    return next;
  });

  const districts = getDistrictNames(form.region);

  const inputCls = 'w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white';
  const selectCls = 'w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white appearance-none cursor-pointer';

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Request Submitted!</h2>
          <p className="text-stone-500 mb-2">Your custom carpentry request has been posted.</p>
          <p className="text-stone-500 mb-6">Verified carpenters near <strong>{form.region}</strong> will send you quotes within <strong>24 hours</strong>.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6 text-sm">
            <p className="font-semibold text-amber-800 mb-2">📋 Your Request Summary</p>
            <p><span className="text-stone-500">Category:</span> <strong>{form.category}</strong></p>
            <p><span className="text-stone-500">Budget:</span> <strong>{form.budget}</strong></p>
            <p><span className="text-stone-500">Timeline:</span> <strong>{form.timeline}</strong></p>
            <p><span className="text-stone-500">Location:</span> <strong>{form.district ? `${form.district}, ` : ''}{form.region}</strong></p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-all text-center">
              View in Dashboard
            </Link>
            <Link href="/carpentry" className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all text-center">
              Browse More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="bg-[#5a3e2b] text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/carpentry" className="text-amber-300 text-sm hover:underline mb-3 inline-block">← Back to Carpentry</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Post a Custom Carpentry Request</h1>
          <p className="text-amber-200 text-sm mt-1">Free to post · Get quotes from verified carpenters in 24hrs</p>
          {/* Steps */}
          <div className="flex items-center gap-2 mt-5">
            {['Project Details', 'Your Info', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? 'bg-green-500' : step === i + 1 ? 'bg-amber-500' : 'bg-white/20'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-white font-semibold' : 'text-white/60'}`}>{s}</span>
                {i < 2 && <div className={`w-6 h-0.5 ${step > i + 1 ? 'bg-green-400' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">

          {/* STEP 1: Project Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-stone-900 text-xl mb-4">Describe Your Project</h2>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-2">Category *</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => update('category', c)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border-2 transition-all ${form.category === c ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-stone-200 text-stone-600 hover:border-amber-200'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">Describe What You Need *</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4}
                  placeholder="e.g. I need a 6-seater dining table with 4 chairs, solid wood, rectangular shape, preferably mahogany with a natural oil finish. Dining room is 4m x 5m."
                  className={inputCls + ' resize-none'} />
                <p className="text-xs text-stone-400 mt-1">The more detail, the better quotes you'll receive</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">Dimensions / Size (optional)</label>
                <input value={form.dimensions} onChange={e => update('dimensions', e.target.value)}
                  placeholder="e.g. 180cm L × 90cm W × 75cm H" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Preferred Wood</label>
                  <div className="relative">
                    <select value={form.woodType} onChange={e => update('woodType', e.target.value)} className={selectCls}>
                      {WOOD_TYPES.map(w => <option key={w}>{w}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Preferred Finish</label>
                  <div className="relative">
                    <select value={form.finish} onChange={e => update('finish', e.target.value)} className={selectCls}>
                      {FINISHES.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Budget *</label>
                  <div className="relative">
                    <select value={form.budget} onChange={e => update('budget', e.target.value)} className={selectCls}>
                      <option value="">— Select Budget —</option>
                      {BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Timeline *</label>
                  <div className="relative">
                    <select value={form.timeline} onChange={e => update('timeline', e.target.value)} className={selectCls}>
                      <option value="">— When do you need it? —</option>
                      {TIMELINES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Your Region *</label>
                  <div className="relative">
                    <select value={form.region} onChange={e => update('region', e.target.value)} className={selectCls}>
                      <option value="">— Select Region —</option>
                      {GHANA_REGIONS.map(r => <option key={r.code} value={r.name}>{r.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">District {form.region && `(${districts.length})`}</label>
                  <div className="relative">
                    <select value={form.district} onChange={e => update('district', e.target.value)} className={selectCls} disabled={!form.region}>
                      <option value="">{form.region ? '— Select District —' : '— Select region first —'}</option>
                      {districts.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                  </div>
                </div>
              </div>

              <button onClick={() => { if (!form.category || !form.description || !form.budget || !form.timeline || !form.region) return alert('Please fill in all required fields'); setStep(2); }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-stone-900 text-xl mb-4">Your Contact Information</h2>
              <p className="text-stone-500 text-sm -mt-2 mb-4">Carpenters will use these details to send quotes and discuss your project.</p>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">Full Name *</label>
                <input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Kwame Asante" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Phone *</label>
                  <div className="flex gap-2">
                    <div className="flex items-center border border-stone-300 rounded-xl px-3 bg-stone-50 text-sm text-stone-600 shrink-0 gap-1">🇬🇭 +233</div>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="24 000 0000" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="kwame@email.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">Delivery / Installation Address</label>
                <textarea value={form.deliveryAddress} onChange={e => update('deliveryAddress', e.target.value)} rows={2} resize-none
                  placeholder="Street address, area, city" className={inputCls + ' resize-none'} />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">🔒 Your privacy is protected</p>
                <p>Contact details are only shared with carpenters you choose to engage. WoodTrade never sells your data.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all">← Back</button>
                <button onClick={() => { if (!form.fullName || !form.phone) return alert('Name and phone are required'); setStep(3); }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md">Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-stone-900 text-xl mb-4">Review & Submit</h2>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-sm">
                {[
                  ['Category', form.category],
                  ['Description', form.description.substring(0, 100) + (form.description.length > 100 ? '...' : '')],
                  ['Wood Type', form.woodType],
                  ['Finish', form.finish],
                  ['Budget', form.budget],
                  ['Timeline', form.timeline],
                  ['Location', `${form.district ? form.district + ', ' : ''}${form.region}`],
                  ['Contact', `${form.fullName} • ${form.phone}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="text-stone-400 w-24 shrink-0">{k}:</span>
                    <span className="font-semibold text-stone-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">📬 What happens next?</p>
                <p>Your request will be visible to verified carpenters in <strong>{form.region}</strong>. You'll receive quotes via phone/email within 24 hours. Posting is 100% free.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50">← Back</button>
                <button onClick={() => setSubmitted(true)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all">
                  🚀 Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
