'use client';
import Link from 'next/link';

const SELLER_TYPES = [
  {
    icon: '🌳', title: 'Harvester / Logger',
    desc: 'Forest owners and concession holders supplying raw logs and timber.',
    licenses: ['TIDD License', 'Forestry Commission Permit', 'Environmental Permit'],
  },
  {
    icon: '🏭', title: 'Manufacturer / Sawmill',
    desc: 'Processing facilities converting logs to lumber, plywood, and engineered wood.',
    licenses: ['TIDD License', 'Business Registration', 'EPA Permit', 'Tax Clearance'],
  },
  {
    icon: '🚢', title: 'Reseller / Exporter',
    desc: 'Traders and export companies connecting Ghanaian suppliers to global buyers.',
    licenses: ['Export License (GEPC)', 'Business Registration', 'Tax Clearance', 'FLEGT'],
  },
];

const REQUIRED_LICENSES = [
  { name: 'TIDD License', issuer: 'Timber Industry Development Division', required: true },
  { name: 'Forestry Commission Permit', issuer: 'Forestry Commission of Ghana', required: true },
  { name: 'Business Registration', issuer: "Registrar General's Department", required: true },
  { name: 'Tax Clearance Certificate', issuer: 'Ghana Revenue Authority', required: true },
  { name: 'Export License', issuer: 'Ghana Export Promotion Council (GEPC)', required: false },
  { name: 'FLEGT License', issuer: 'Forestry Commission (EU trade)', required: false },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Register', desc: 'Create your seller account with company details.' },
  { step: '02', title: 'Upload Licenses', desc: 'Submit your TIDD, Forestry Commission, and business licenses for admin review.' },
  { step: '03', title: 'Get Verified', desc: 'Our compliance team reviews your documents within 24-48 hours.' },
  { step: '04', title: 'List Products', desc: 'Add your wood products with traceability information and competitive pricing.' },
  { step: '05', title: 'Sell Globally', desc: 'Receive orders from local and international buyers with automated export documentation.' },
];

export default function SellPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#5a3e2b] to-[#3d2210] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-5">
            Sell Your Wood Products<br />to the World
          </h1>
          <p className="text-amber-200 text-xl max-w-2xl mx-auto mb-8">
            Join 1,200+ verified Ghanaian wood businesses. Access buyers in the USA, Europe, and Asia with full export compliance support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/register?role=seller" className="btn-primary text-base px-8 py-4">
              Start Selling Today
            </Link>
            <a href="#requirements" className="btn-outline text-base px-8 py-4">
              View Requirements
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading text-center mb-10">Why Sell on WoodTrade?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { icon: '🌍', title: 'Global Reach', desc: 'Connect with verified importers in 45+ countries' },
            { icon: '📄', title: 'Auto-Documents', desc: 'Lacey Act, EUDR, certificates generated automatically' },
            { icon: '💰', title: 'Better Prices', desc: 'Transparent pricing eliminates middlemen' },
            { icon: '🛡️', title: 'Verified Badge', desc: 'Gain buyer trust with our compliance verification' },
            { icon: '📊', title: 'Analytics', desc: 'Track views, inquiries, and revenue in real time' },
            { icon: '🔔', title: 'License Alerts', desc: 'Get reminded 60 days before licenses expire' },
          ].map((b) => (
            <div key={b.title} className="card p-6 text-center">
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-stone-900 mb-2">{b.title}</h3>
              <p className="text-stone-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seller Types */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center mb-3">What Type of Seller Are You?</h2>
          <p className="text-stone-500 text-center mb-10">Each seller type has different license requirements</p>
          <div className="grid md:grid-cols-3 gap-6">
            {SELLER_TYPES.map((type) => (
              <div key={type.title} className="card p-6">
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{type.title}</h3>
                <p className="text-stone-500 text-sm mb-4">{type.desc}</p>
                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase mb-2">Required Licenses</p>
                  <ul className="space-y-1">
                    {type.licenses.map((lic) => (
                      <li key={lic} className="text-sm text-stone-700 flex items-center gap-2">
                        <span className="text-amber-500">•</span> {lic}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/auth/register?role=${type.title.toLowerCase().replace(/\/.+$/, '').replace(' ', '_')}`}
                  className="mt-5 block text-center btn-primary text-sm"
                >
                  Register as {type.title.split('/')[0].trim()}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* License Requirements */}
      <section id="requirements" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading text-center mb-3">License Requirements</h2>
        <p className="text-stone-500 text-center mb-10">All sellers must upload valid Ghanaian licenses. Our team verifies within 24-48 hours.</p>
        <div className="max-w-3xl mx-auto space-y-4">
          {REQUIRED_LICENSES.map((lic) => (
            <div key={lic.name} className="bg-white rounded-xl border border-stone-200 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-stone-900">{lic.name}</h3>
                  {lic.required
                    ? <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">Required</span>
                    : <span className="bg-stone-100 text-stone-600 text-xs font-semibold px-2 py-0.5 rounded">Recommended</span>
                  }
                </div>
                <p className="text-stone-500 text-sm">{lic.issuer}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-serif text-center mb-12">How to Get Started</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="text-center relative">
                <div className="text-5xl font-black text-amber-500 mb-3">{step.step}</div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-amber-200 text-sm">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-amber-400 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/auth/register?role=seller" className="bg-white text-amber-800 font-bold px-10 py-4 rounded-xl hover:bg-amber-50 transition-colors text-base">
              Register Now — Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
