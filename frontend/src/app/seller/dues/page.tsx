'use client';
import { useState } from 'react';
import Link from 'next/link';

const MOMO_NUMBER = '0240715156';
const DUES_AMOUNT = 10; // GHS

export default function SellerDuesPage() {
  const [step, setStep] = useState<'info' | 'pay' | 'success'>('info');
  const [method, setMethod] = useState<'mtn' | 'telecel' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [txRef] = useState(`DUES-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`);

  const currentMonth = new Date().toLocaleString('en-GH', { month: 'long', year: 'numeric' });
  const nextDue = new Date(new Date().setDate(1));
  nextDue.setMonth(nextDue.getMonth() + 1);
  const nextDueStr = nextDue.toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2500));
    setLoading(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Dues Paid Successfully!</h2>
          <p className="text-stone-500 mb-6">Your WoodTrade Ghana platform dues for <strong>{currentMonth}</strong> have been paid.</p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left text-sm space-y-1.5 mb-6">
            <p className="font-semibold text-green-800 mb-2">✅ Payment Receipt</p>
            <p><span className="text-stone-500">Amount:</span> <strong>GHS {DUES_AMOUNT}</strong></p>
            <p><span className="text-stone-500">Month:</span> <strong>{currentMonth}</strong></p>
            <p><span className="text-stone-500">Paid to:</span> <strong className="font-mono">MTN {MOMO_NUMBER}</strong></p>
            <p><span className="text-stone-500">Reference:</span> <strong className="font-mono">{txRef}</strong></p>
            <p><span className="text-stone-500">Next Due:</span> <strong>{nextDueStr}</strong></p>
          </div>
          <Link href="/dashboard" className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm text-center transition-all">
            Back to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="bg-[#5a3e2b] text-white py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Link href="/dashboard" className="text-amber-300 text-sm hover:underline mb-3 inline-block">← Dashboard</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Monthly Platform Dues</h1>
          <p className="text-amber-200 text-sm mt-1">Keep your seller account active on WoodTrade Ghana</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-5">

        {/* Dues info card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">🌳</div>
            <div>
              <h3 className="font-bold text-stone-900">WoodTrade Ghana Seller Dues</h3>
              <p className="text-stone-500 text-sm">Monthly platform renewal fee</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">GHS {DUES_AMOUNT}</p>
              <p className="text-xs text-stone-500 mt-0.5">Per Month</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-stone-900">{currentMonth}</p>
              <p className="text-xs text-stone-500 mt-0.5">Current Month</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-stone-900">1st</p>
              <p className="text-xs text-stone-500 mt-0.5">Due Date</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-semibold text-stone-700">✅ Your dues include:</p>
            {[
              'Active seller profile & listings',
              'Access to all 16 regional admin offices',
              'Export compliance document generation',
              'Buyer enquiry notifications',
              'Dashboard analytics & reports',
              'Priority customer support',
            ].map(b => (
              <div key={b} className="flex items-center gap-2 text-stone-600">
                <span className="text-green-500 shrink-0">✓</span> {b}
              </div>
            ))}
          </div>
        </div>

        {/* Payment destination */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📱</span> Pay via MTN MoMo
          </h3>
          <div className="bg-white border border-yellow-300 rounded-xl p-4 text-center mb-3">
            <p className="text-xs text-stone-500 mb-1">Send GHS {DUES_AMOUNT} to this MTN number</p>
            <p className="text-3xl font-black text-yellow-700 tracking-widest font-mono">{MOMO_NUMBER}</p>
            <p className="text-xs text-stone-500 mt-1">Account Name: WoodTrade Ghana Platform</p>
          </div>
          <div className="text-xs text-yellow-800 space-y-1">
            <p>📌 Use your <strong>registered email or phone</strong> as the payment reference</p>
            <p>📌 Payment must be received by the <strong>1st of each month</strong></p>
            <p>📌 Late payments may result in temporary account suspension</p>
          </div>
        </div>

        {/* Quick Pay button */}
        {step === 'info' && (
          <div className="space-y-3">
            <button onClick={() => setStep('pay')}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold py-4 rounded-2xl text-base transition-all shadow-lg flex items-center justify-center gap-3">
              <span className="text-2xl">M</span>
              Pay GHS {DUES_AMOUNT} with MTN MoMo →
            </button>
            <Link href={`/payment?orderId=${txRef}&amount=${DUES_AMOUNT}&desc=Monthly+Seller+Dues+${currentMonth}&return=/seller/dues`}
              className="block w-full bg-white border-2 border-stone-300 hover:border-amber-400 text-stone-700 font-semibold py-3 rounded-2xl text-sm text-center transition-all">
              Other Payment Methods (Bank Transfer, Telecel Cash)
            </Link>
          </div>
        )}

        {step === 'pay' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900">Quick MoMo Payment</h3>
            <p className="text-sm text-stone-500">Enter your MTN number to receive a payment prompt for GHS {DUES_AMOUNT}</p>
            <div>
              <label className="text-sm font-semibold text-stone-700 block mb-1.5">Your MTN Number</label>
              <div className="flex gap-2">
                <div className="flex items-center border border-stone-300 rounded-xl px-3 bg-stone-50 text-sm text-stone-600 shrink-0">🇬🇭 +233</div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10}
                  placeholder="024 XXXXXXX"
                  className="flex-1 border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
              You will receive a MoMo prompt to approve GHS {DUES_AMOUNT} payment to <strong>{MOMO_NUMBER}</strong>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('info')} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50">← Back</button>
              <button onClick={handlePay} disabled={loading || phone.length < 10}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-yellow-900 font-bold py-3 rounded-xl text-sm transition-all shadow-md">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </span>
                ) : `Pay GHS ${DUES_AMOUNT} →`}
              </button>
            </div>
          </div>
        )}

        {/* History */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-3">Payment History</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-stone-500 uppercase">
              <tr>
                {['Month', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { month: 'April 2026', amount: 10, date: '01 Apr', status: 'paid' },
                { month: 'March 2026', amount: 10, date: '01 Mar', status: 'paid' },
                { month: 'February 2026', amount: 10, date: '01 Feb', status: 'paid' },
                { month: 'January 2026', amount: 10, date: '01 Jan', status: 'paid' },
              ].map(r => (
                <tr key={r.month}>
                  <td className="py-2.5 text-stone-700">{r.month}</td>
                  <td className="py-2.5 font-bold text-stone-900">GHS {r.amount}</td>
                  <td className="py-2.5 text-stone-500">{r.date}</td>
                  <td className="py-2.5"><span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✓ Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-stone-400">
          For payment issues, contact: <a href="mailto:baristernkuah@gmail.com" className="text-amber-700 hover:underline">baristernkuah@gmail.com</a> | <a href="tel:0240715156" className="text-amber-700 hover:underline">0240715156</a>
        </p>
      </div>
    </div>
  );
}
