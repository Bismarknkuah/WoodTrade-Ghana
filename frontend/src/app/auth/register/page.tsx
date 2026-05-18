'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GHANA_REGIONS, getDistrictNames } from '../../../lib/ghanaRegions';

const ROLES = [
  { value: 'buyer', label: '🛒 Buyer', desc: 'Purchase wood products locally or internationally' },
  { value: 'seller', label: '🌳 Seller / Harvester', desc: 'Sell raw timber and wood materials' },
  { value: 'carpenter', label: '🪑 Carpenter / Furniture Maker', desc: 'Sell furniture, doors, cabinets & finished woodwork' },
  { value: 'manufacturer', label: '🏭 Manufacturer', desc: 'Sell processed and engineered wood products' },
  { value: 'reseller', label: '🚢 Reseller / Exporter', desc: 'Trade and export wood to international markets' },
];

// Document requirements per role
const ROLE_DOCS: Record<string, { required: string[]; note: string }> = {
  buyer: { required: [], note: '' },
  carpenter: {
    required: ['Business Registration Certificate', 'Ghana Card (National ID)'],
    note: 'As a carpenter selling finished works, you only need your Business Certificate and Ghana Card. No forestry documents required.',
  },
  seller: {
    required: ['TIDD License', 'Forestry Commission Certificate', 'Business Registration', 'Tax Clearance'],
    note: 'Raw timber sellers require full forestry compliance documentation.',
  },
  manufacturer: {
    required: ['TIDD License', 'Business Registration', 'Tax Clearance', 'Environmental Permit'],
    note: 'Manufacturers require forestry and environmental compliance documentation.',
  },
  reseller: {
    required: ['Export License (GEPC)', 'Business Registration', 'Tax Clearance', 'FLEGT License'],
    note: 'Exporters require full export compliance documentation.',
  },
};

const inputClass = 'w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-white';
const selectClass = 'w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-white appearance-none cursor-pointer';
const labelClass = 'text-sm font-medium text-stone-700 block mb-1.5';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'buyer',
    company: '',
    region: '',
    district: '',
    address: '',
    businessRegNumber: '',
    taxIdNumber: '',
    country: 'Ghana',
  });

  const update = (field: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Reset district when region changes
      if (field === 'region') next.district = '';
      return next;
    });
  };

  const districts = getDistrictNames(form.region);

  const validateStep2 = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (!form.email.trim() || !form.email.includes('@')) return 'Valid email is required';
    if (!form.phone.trim()) return 'Phone number is required';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateStep3 = () => {
    if (!form.region) return 'Please select your region';
    if (districts.length > 0 && !form.district) return 'Please select your district';
    if (form.role !== 'buyer' && !form.company.trim()) return 'Company name is required';
    return '';
  };

  const handleNext = (nextStep: number) => {
    if (nextStep === 3) {
      const err = validateStep2();
      if (err) { setError(err); return; }
    }
    setError('');
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    const err = validateStep3();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          companyName: form.company,
          region: form.region,
          district: form.district,
          address: form.address,
          businessRegistrationNumber: form.businessRegNumber,
          taxIdentificationNumber: form.taxIdNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Registration failed');
      if (data.token) localStorage.setItem('wt_token', data.token);
      setSuccess(true);
      setTimeout(() => window.location.href = '/dashboard', 2500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Account Created!</h2>
          <p className="text-stone-500 mb-2">
            {form.role === 'buyer'
              ? 'Your buyer account is ready. Redirecting to dashboard...'
              : 'Your account has been created! Please upload your licenses for admin review before listing products.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 text-sm font-medium">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ['Account Type', 'Personal Info', 'Business & Location'];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-20 pt-24">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-[#5a3e2b]">🌳 WoodTrade Ghana</Link>
          <h1 className="text-xl font-bold text-stone-900 mt-3">Create Account</h1>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? 'bg-green-500 text-white' : step === s ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 rounded ${step > s ? 'bg-green-400' : 'bg-stone-200'}`} />}
              </div>
            ))}
          </div>
          <p className="text-stone-400 text-xs mt-2">Step {step} of 3 — {stepTitles[step - 1]}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── STEP 1: Role ── */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-stone-800 mb-3">I want to...</h2>
            {ROLES.map((role) => (
              <label key={role.value} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                form.role === role.value ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-stone-200 hover:border-amber-200 hover:bg-stone-50'
              }`}>
                <input type="radio" name="role" value={role.value}
                  checked={form.role === role.value}
                  onChange={e => update('role', e.target.value)}
                  className="mt-0.5 accent-amber-500" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{role.label}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{role.desc}</p>
                </div>
              </label>
            ))}
            <button onClick={() => setStep(2)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl mt-4 transition-all shadow-md">
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Personal Info ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-stone-800 mb-2">Personal Information</h2>

            <Field label="Full Name *">
              <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                placeholder="Kwame Asante" className={inputClass} />
            </Field>

            <Field label="Email Address *">
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="kwame@timber.com" className={inputClass} />
            </Field>

            <Field label="Phone Number *">
              <div className="flex gap-2">
                <div className="flex items-center border border-stone-300 rounded-xl px-3 bg-stone-50 text-sm text-stone-600 shrink-0 gap-1.5">
                  <span>🇬🇭</span> +233
                </div>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="24 000 0000" className={inputClass} />
              </div>
            </Field>

            <Field label="Country">
              <select value={form.country} onChange={e => update('country', e.target.value)} className={selectClass}>
                <option value="Ghana">🇬🇭 Ghana</option>
                <option value="USA">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="China">🇨🇳 China</option>
                <option value="Other">🌍 Other</option>
              </select>
            </Field>

            <Field label="Password *">
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                placeholder="Min 8 characters" className={inputClass} />
              {form.password && (
                <div className="mt-1.5 flex gap-1">
                  {['length', 'upper', 'number'].map((check, i) => {
                    const ok = check === 'length' ? form.password.length >= 8 : check === 'upper' ? /[A-Z]/.test(form.password) : /[0-9]/.test(form.password);
                    return <div key={i} className={`h-1 flex-1 rounded-full transition-all ${ok ? 'bg-green-400' : 'bg-stone-200'}`} />;
                  })}
                </div>
              )}
            </Field>

            <Field label="Confirm Password *">
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                placeholder="Repeat your password" className={inputClass} />
              {form.confirmPassword && (
                <p className={`text-xs mt-1 ${form.password === form.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </Field>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all">
                ← Back
              </button>
              <button onClick={() => handleNext(3)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Business & Location ── */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-stone-800 mb-2">Business & Location</h2>

            {form.role !== 'buyer' && (
              <>
                <Field label="Company Name *">
                  <input type="text" value={form.company} onChange={e => update('company', e.target.value)}
                    placeholder="Asante Timber Co. Ltd." className={inputClass} />
                </Field>
                <Field label="Business Registration Number">
                  <input type="text" value={form.businessRegNumber} onChange={e => update('businessRegNumber', e.target.value)}
                    placeholder="BN-GH-XXXXXX" className={inputClass} />
                </Field>
                <Field label="Tax Identification Number (TIN)">
                  <input type="text" value={form.taxIdNumber} onChange={e => update('taxIdNumber', e.target.value)}
                    placeholder="GHA-XXXXXXXXX" className={inputClass} />
                </Field>
              </>
            )}

            {/* Region */}
            <Field label="Region *">
              <div className="relative">
                <select value={form.region} onChange={e => update('region', e.target.value)} className={selectClass}>
                  <option value="">— Select Region —</option>
                  {GHANA_REGIONS.map(r => (
                    <option key={r.code} value={r.name}>{r.name} Region</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
              </div>
            </Field>

            {/* District — only shows after region is selected */}
            {form.region && districts.length > 0 && (
              <Field label={`District in ${form.region} *`}>
                <div className="relative">
                  <select value={form.district} onChange={e => update('district', e.target.value)} className={selectClass}>
                    <option value="">— Select District ({districts.length} available) —</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">▾</div>
                </div>
              </Field>
            )}

            <Field label="Business / Home Address">
              <textarea value={form.address} onChange={e => update('address', e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all resize-none"
                rows={2} placeholder="Street, Town, Ghana" />
            </Field>

            {/* Summary preview */}
            {form.region && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-700 mb-1">📍 Location Summary</div>
                <div>Region: <span className="font-semibold text-stone-900">{form.region}</span></div>
                {form.district && <div>District: <span className="font-semibold text-stone-900">{form.district}</span></div>}
              </div>
            )}

            {form.role !== 'buyer' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-semibold mb-1">📋 Next Step: Upload Licenses</p>
                <p className="text-xs">After registration, upload your TIDD license and documents in the dashboard. Admin review required before listing products.</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating...
                  </span>
                ) : '🎉 Create Account'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-stone-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center text-stone-500">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
