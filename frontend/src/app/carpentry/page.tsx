'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCurrency } from '../../components/ui/Navbar';

const FEATURED_CARPENTERS = [
  { id: '1', name: 'Kofi Craftworks', owner: 'Kofi Mensah', region: 'Greater Accra', specialty: 'Luxury Furniture & Office Fit-outs', rating: 4.9, reviews: 128, jobs: 243, verified: true, years: 12, image: '🪑' },
  { id: '2', name: 'AccraWood Interiors', owner: 'Ama Boateng', region: 'Greater Accra', specialty: 'Kitchen Cabinets & Built-ins', rating: 4.8, reviews: 96, jobs: 187, verified: true, years: 8, image: '🚪' },
  { id: '3', name: 'Kumasi Furniture Hub', owner: 'Kweku Asante', region: 'Ashanti', specialty: 'Bedroom Furniture & Wardrobes', rating: 4.7, reviews: 74, jobs: 156, verified: true, years: 15, image: '🪑' },
  { id: '4', name: 'Tema Doors & Frames', owner: 'Nana Osei', region: 'Greater Accra', specialty: 'Doors, Windows & Frames', rating: 4.6, reviews: 112, jobs: 321, verified: true, years: 10, image: '🚪' },
  { id: '5', name: 'GreenCraft Ghana', owner: 'Abena Frimpong', region: 'Eastern', specialty: 'Outdoor & Garden Furniture', rating: 4.8, reviews: 58, jobs: 94, verified: true, years: 6, image: '🌿' },
  { id: '6', name: 'Northern Woodworks', owner: 'Abdulai Tanko', region: 'Northern', specialty: 'Traditional & Contemporary Furniture', rating: 4.5, reviews: 41, jobs: 78, verified: true, years: 9, image: '🪑' },
];

const CATEGORIES = [
  { icon: '🪑', name: 'Furniture', desc: 'Sofas, chairs, beds, tables' },
  { icon: '🚪', name: 'Doors & Windows', desc: 'Interior & exterior wood doors' },
  { icon: '🍳', name: 'Kitchen Cabinets', desc: 'Custom kitchen fits' },
  { icon: '👔', name: 'Wardrobes', desc: 'Fitted & sliding wardrobes' },
  { icon: '💼', name: 'Office Furniture', desc: 'Desks, shelving, reception' },
  { icon: '🌿', name: 'Outdoor', desc: 'Garden benches, pergolas' },
  { icon: '✏️', name: 'Custom Orders', desc: 'Any bespoke woodwork' },
  { icon: '🏗️', name: 'Fit-outs', desc: 'Full room or office fit-outs' },
];

const HOW_IT_WORKS = [
  { step: 1, icon: '📝', title: 'Describe Your Project', desc: 'Tell us what you need — dimensions, wood type, finish, and budget. Upload reference images if you have them.' },
  { step: 2, icon: '📬', title: 'Receive Quotes', desc: 'Verified carpenters in your area review your request and send competitive quotes within 24 hours.' },
  { step: 3, icon: '✅', title: 'Choose Your Carpenter', desc: 'Compare quotes, portfolios, and ratings. Chat directly before deciding.' },
  { step: 4, icon: '🚚', title: 'Track & Receive', desc: 'Track your project\'s progress. Pay securely when satisfied with delivery.' },
];

export default function CarpentryPage() {
  const { currency } = useCurrency();
  const symbol = currency === 'GHS' ? '₵' : '$';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#3d2210] to-[#6b4f3a] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🪑</div>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Ghana's Carpentry Marketplace
          </h1>
          <p className="text-amber-200 text-lg mb-8">
            Connect with verified Ghanaian carpenters for furniture, doors, cabinets, and custom woodwork
          </p>
          {/* Search */}
          <div className="flex gap-3 max-w-xl mx-auto">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="What do you need? e.g. kitchen cabinets, office desk..."
              className="flex-1 px-4 py-3 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
            <Link href={`/catalog?tab=carpentry&search=${searchQuery}`}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
              Search
            </Link>
          </div>
          <div className="flex gap-4 justify-center mt-6 text-sm">
            <span className="bg-white/10 px-3 py-1.5 rounded-full">✅ Verified Carpenters</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full">💬 Direct Chat</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full">🔒 Secure Payments</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(c => (
              <Link key={c.name} href={`/catalog?tab=carpentry&category=${c.name}`}
                className="bg-white border border-stone-200 rounded-2xl p-5 text-center hover:border-amber-300 hover:shadow-md transition-all group">
                <div className="text-4xl mb-2">{c.icon}</div>
                <div className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">{c.name}</div>
                <div className="text-xs text-stone-500 mt-1">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Custom Request CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Have Something Custom in Mind?</h3>
            <p className="text-amber-100">Describe your project and get quotes from up to 5 verified carpenters near you — for free.</p>
            <ul className="mt-3 space-y-1 text-sm text-amber-100">
              <li>✓ Free to post your request</li>
              <li>✓ Quotes within 24 hours</li>
              <li>✓ Choose from verified carpenters only</li>
            </ul>
          </div>
          <Link href="/carpentry/request"
            className="bg-white text-amber-800 font-bold px-8 py-3 rounded-xl hover:bg-amber-50 transition-all text-sm shrink-0 shadow-lg">
            Post a Custom Request →
          </Link>
        </div>

        {/* How it Works */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(s => (
              <div key={s.step} className="bg-white border border-stone-200 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-lg mb-3">{s.step}</div>
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Carpenters */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>Featured Carpenters</h2>
            <Link href="/catalog?tab=carpentry" className="text-amber-700 hover:underline text-sm font-semibold">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_CARPENTERS.map(c => (
              <div key={c.id} className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">{c.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900">{c.name}</h3>
                      {c.verified && <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">✅ Verified</span>}
                    </div>
                    <p className="text-xs text-stone-500">{c.owner} • {c.region}</p>
                    <p className="text-xs text-amber-700 font-medium mt-0.5">{c.specialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-stone-50 rounded-lg py-2">
                    <div className="font-bold text-stone-900 text-sm">{c.rating}</div>
                    <div className="text-xs text-stone-400">Rating</div>
                  </div>
                  <div className="bg-stone-50 rounded-lg py-2">
                    <div className="font-bold text-stone-900 text-sm">{c.jobs}</div>
                    <div className="text-xs text-stone-400">Jobs done</div>
                  </div>
                  <div className="bg-stone-50 rounded-lg py-2">
                    <div className="font-bold text-stone-900 text-sm">{c.years}y</div>
                    <div className="text-xs text-stone-400">Experience</div>
                  </div>
                </div>
                <Link href={`/catalog?tab=carpentry&seller=${c.name}`}
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-xl text-sm transition-all">
                  View Portfolio →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Join as Carpenter CTA */}
        <div className="bg-[#3d2210] text-white rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🛠️</div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Are You a Carpenter?</h3>
          <p className="text-stone-300 mb-6 max-w-xl mx-auto">Join WoodTrade Ghana and reach thousands of customers. Only a Business Certificate and Ghana Card required to start selling.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register?role=carpenter"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-xl transition-all">
              Join as Carpenter →
            </Link>
            <Link href="/sell#carpenter"
              className="border border-white text-white hover:bg-white hover:text-amber-800 font-semibold px-8 py-3 rounded-xl transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
