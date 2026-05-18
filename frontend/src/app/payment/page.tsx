'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const BANK_DETAILS = [
  { bank: 'Ghana Commercial Bank (GCB)', account: '1234567890123', name: 'WoodTrade Ghana Ltd.', branch: 'Accra Main Branch', code: 'GCB001' },
  { bank: 'Ecobank Ghana', account: '9876543210987', name: 'WoodTrade Ghana Ltd.', branch: 'Accra Ring Road', code: 'ECO002' },
  { bank: 'Absa Bank Ghana', account: '5678901234567', name: 'WoodTrade Ghana Ltd.', branch: 'Accra Liberation Road', code: 'ABS003' },
];

type Method = 'mtn' | 'telecel' | 'bank' | null;
type Step = 'select' | 'details' | 'confirm' | 'processing' | 'success' | 'failed';

function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId    = searchParams.get('orderId') || 'WTG-ORD-DEMO';
  const amountGHS  = Number(searchParams.get('amount') || '1500');
  const description = searchParams.get('desc') || 'WoodTrade Ghana Order';
  const returnUrl  = searchParams.get('return') || '/dashboard';

  const [method, setMethod]     = useState<Method>(null);
  const [step, setStep]         = useState<Step>('select');
  const [phone, setPhone]       = useState('');
  const [network, setNetwork]   = useState<'mtn' | 'telecel'>('mtn');
  const [selectedBank, setSelectedBank] = useState(BANK_DETAILS[0]);
  const [otp, setOtp]           = useState('');
  const [otpSent, setOtpSent]   = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError]       = useState('');
  const [txRef]                 = useState(`WTG-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);

  // Countdown for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Auto-advance processing -> success
  useEffect(() => {
    if (step === 'processing') {
      const t = setTimeout(() => setStep('success'), 4000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const sendOtp = () => {
    setOtpSent(true);
    setCountdown(60);
    setError('');
  };

  const validatePhone = (p: string) => /^(0[0-9]{9})$/.test(p.replace(/\s/g, ''));

  const processMoMo = () => {
    const clean = phone.replace(/\s/g, '');
    if (!validatePhone(clean)) { setError('Enter a valid 10-digit Ghana phone number'); return; }
    if (!otpSent) { setError('Please send and enter the OTP first'); return; }
    if (otp.length < 4) { setError('Enter the OTP sent to your phone'); return; }
    setStep('processing');
  };

  const processBank = () => {
    setStep('confirm');
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Processing Payment...</h2>
          <p className="text-stone-500 text-sm mb-4">
            {method === 'mtn' ? 'Check your MTN MoMo prompt and approve the payment' :
             method === 'telecel' ? 'Check your Telecel Cash prompt and approve the payment' :
             'Verifying your bank transfer...'}
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold">Amount: GHS {amountGHS.toLocaleString()}</p>
            <p className="text-xs mt-1">Reference: {txRef}</p>
          </div>
          <p className="text-xs text-stone-400 mt-4">Do not close this page</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
          <p className="text-stone-500 text-sm mb-6">Your payment has been confirmed and your order is being processed.</p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-left mb-6 space-y-1.5">
            <p className="font-semibold text-green-800 mb-2">📋 Transaction Receipt</p>
            <p><span className="text-stone-500">Amount:</span> <strong>GHS {amountGHS.toLocaleString()}</strong></p>
            <p><span className="text-stone-500">Order ID:</span> <strong className="font-mono">{orderId}</strong></p>
            <p><span className="text-stone-500">Reference:</span> <strong className="font-mono">{txRef}</strong></p>
            <p><span className="text-stone-500">Method:</span> <strong>{method === 'mtn' ? 'MTN MoMo' : method === 'telecel' ? 'Telecel Cash' : 'Bank Transfer'}</strong></p>
            <p><span className="text-stone-500">Status:</span> <strong className="text-green-700">Confirmed ✓</strong></p>
          </div>
          <div className="flex gap-3">
            <Link href={returnUrl} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm transition-all text-center">
              View Order →
            </Link>
            <Link href="/dashboard" className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all text-center">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="bg-[#5a3e2b] text-white py-8 px-4">
        <div className="max-w-xl mx-auto">
          <Link href={returnUrl} className="text-amber-300 text-sm hover:underline mb-3 inline-block">← Back to Order</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Secure Payment</h1>
          <p className="text-amber-200 text-sm mt-1">WoodTrade Ghana — Secure Checkout</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
        {/* Order summary */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-500">Order ID</span>
            <span className="font-mono font-semibold text-amber-700">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-500">Description</span>
            <span className="font-medium text-stone-900">{description}</span>
          </div>
          <div className="border-t border-stone-100 pt-3 mt-3 flex justify-between">
            <span className="font-bold text-stone-800">Total Amount</span>
            <span className="text-2xl font-bold text-amber-700">GHS {amountGHS.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment method selection */}
        {step === 'select' && (
          <div className="space-y-4">
            <h3 className="font-bold text-stone-800">Choose Payment Method</h3>
            <div className="grid gap-3">
              {/* MTN MoMo */}
              <button onClick={() => { setMethod('mtn'); setNetwork('mtn'); setStep('details'); }}
                className="bg-white border-2 border-stone-200 hover:border-yellow-400 rounded-2xl p-5 flex items-center gap-4 transition-all group text-left">
                <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center text-2xl font-black text-yellow-900 shrink-0">M</div>
                <div className="flex-1">
                  <p className="font-bold text-stone-900 group-hover:text-yellow-700">MTN Mobile Money</p>
                  <p className="text-xs text-stone-500 mt-0.5">Pay with your MTN MoMo wallet — instant confirmation</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5 rounded-full">Instant</span>
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓ Most Popular</span>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-yellow-500 text-xl">›</span>
              </button>

              {/* Telecel Cash */}
              <button onClick={() => { setMethod('telecel'); setNetwork('telecel'); setStep('details'); }}
                className="bg-white border-2 border-stone-200 hover:border-red-400 rounded-2xl p-5 flex items-center gap-4 transition-all group text-left">
                <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center text-xl font-black text-white shrink-0">TC</div>
                <div className="flex-1">
                  <p className="font-bold text-stone-900 group-hover:text-red-700">Telecel Cash</p>
                  <p className="text-xs text-stone-500 mt-0.5">Pay with Telecel (formerly Vodafone) Cash wallet</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">Instant</span>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-red-500 text-xl">›</span>
              </button>

              {/* Bank Transfer */}
              <button onClick={() => { setMethod('bank'); setStep('details'); }}
                className="bg-white border-2 border-stone-200 hover:border-blue-400 rounded-2xl p-5 flex items-center gap-4 transition-all group text-left">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-2xl text-white shrink-0">🏦</div>
                <div className="flex-1">
                  <p className="font-bold text-stone-900 group-hover:text-blue-700">Bank Transfer</p>
                  <p className="text-xs text-stone-500 mt-0.5">Transfer directly from your bank account (GCB, Ecobank, Absa)</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">1–2 hours</span>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-blue-500 text-xl">›</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 justify-center mt-4">
              <span>🔒</span>
              <span>Payments are secured by WoodTrade Ghana SSL encryption. Your financial data is never stored.</span>
            </div>
          </div>
        )}

        {/* MoMo Details */}
        {step === 'details' && (method === 'mtn' || method === 'telecel') && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-xl ${method === 'mtn' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-600 text-white'} flex items-center justify-center font-black text-lg`}>
                {method === 'mtn' ? 'M' : 'TC'}
              </div>
              <div>
                <h3 className="font-bold text-stone-900">{method === 'mtn' ? 'MTN Mobile Money' : 'Telecel Cash'}</h3>
                <p className="text-xs text-stone-500">Enter your {method === 'mtn' ? 'MTN' : 'Telecel'} number to proceed</p>
              </div>
            </div>

            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">⚠ {error}</p>}

            <div>
              <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                {method === 'mtn' ? 'MTN' : 'Telecel'} Phone Number *
              </label>
              <div className="flex gap-2">
                <div className="flex items-center border border-stone-300 rounded-xl px-3 bg-stone-50 text-sm text-stone-600 shrink-0 gap-1.5">🇬🇭 +233</div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder={method === 'mtn' ? '055/024/059 XXXXXXX' : '050 XXXXXXX'}
                  maxLength={10}
                  className="flex-1 border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {method === 'mtn' ? 'MTN numbers: 024, 054, 055, 059, 025' : 'Telecel numbers: 050, 020'}
              </p>
            </div>

            {/* Amount display */}
            <div className={`${method === 'mtn' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-xl p-4 text-center`}>
              <p className="text-xs text-stone-500 mb-1">You will be charged</p>
              <p className="text-3xl font-bold text-stone-900">GHS {amountGHS.toLocaleString()}</p>
              <p className="text-xs text-stone-400 mt-1">for Order {orderId}</p>
            </div>

            {/* OTP Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-stone-700">OTP (One-Time Password)</label>
                {countdown > 0 ? (
                  <span className="text-xs text-stone-400">Resend in {countdown}s</span>
                ) : (
                  <button onClick={sendOtp} disabled={!validatePhone(phone.replace(/\s/g, ''))}
                    className="text-xs text-amber-700 hover:underline font-semibold disabled:opacity-40">
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
              {otpSent && (
                <>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  <p className="text-xs text-green-600 mt-1">✓ OTP sent to +233{phone}</p>
                </>
              )}
              {!otpSent && (
                <p className="text-xs text-stone-400">Click "Send OTP" to receive a verification code on your phone</p>
              )}
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600">
              <p className="font-semibold mb-1">📱 How it works:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Enter your {method === 'mtn' ? 'MTN' : 'Telecel'} number above</li>
                <li>Click "Send OTP" — you&apos;ll receive a 6-digit code</li>
                <li>Enter the OTP and click Pay</li>
                <li>Approve the payment prompt on your phone</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep('select'); setError(''); setOtp(''); setOtpSent(false); }}
                className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50 transition-all">← Back</button>
              <button onClick={processMoMo}
                className={`flex-1 ${method === 'mtn' ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-red-600 hover:bg-red-500'} text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md`}>
                Pay GHS {amountGHS.toLocaleString()} →
              </button>
            </div>
          </div>
        )}

        {/* Bank Transfer Details */}
        {step === 'details' && method === 'bank' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">🏦 Bank Transfer Details</h3>
            <p className="text-sm text-stone-500">Transfer exactly <strong>GHS {amountGHS.toLocaleString()}</strong> to one of these accounts and use your Order ID as reference.</p>

            <div className="space-y-3">
              {BANK_DETAILS.map((bank, i) => (
                <div key={i} onClick={() => setSelectedBank(bank)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedBank.bank === bank.bank ? 'border-blue-400 bg-blue-50' : 'border-stone-200 hover:border-blue-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{bank.bank.slice(0,3)}</div>
                    <div>
                      <p className="font-bold text-stone-900 text-sm">{bank.bank}</p>
                      <p className="text-xs text-stone-500">{bank.branch}</p>
                    </div>
                    {selectedBank.bank === bank.bank && <span className="ml-auto text-blue-500 font-bold">✓</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-stone-400">Account Name</span><br/><strong>{bank.name}</strong></div>
                    <div><span className="text-stone-400">Account Number</span><br/><strong className="font-mono">{bank.account}</strong></div>
                    <div><span className="text-stone-400">Bank Code</span><br/><strong className="font-mono">{bank.code}</strong></div>
                    <div><span className="text-stone-400">Amount</span><br/><strong className="text-green-700">GHS {amountGHS.toLocaleString()}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">⚠️ Important — Use this reference:</p>
              <p className="font-mono text-lg font-bold text-center bg-white border border-amber-300 rounded-lg py-2 px-4 mt-2">{orderId}</p>
              <p className="text-xs mt-2">Without the correct reference, your payment cannot be matched to your order.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('select')}
                className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50">← Back</button>
              <button onClick={processBank}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md">
                I&apos;ve Transferred →
              </button>
            </div>
          </div>
        )}

        {/* Bank confirm step */}
        {step === 'confirm' && method === 'bank' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900">Confirm Bank Transfer</h3>
            <p className="text-sm text-stone-500">Please confirm you have transferred the exact amount to <strong>{selectedBank.bank}</strong></p>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-stone-500">Amount transferred:</span><strong>GHS {amountGHS.toLocaleString()}</strong></div>
              <div className="flex justify-between"><span className="text-stone-500">To bank:</span><strong>{selectedBank.bank}</strong></div>
              <div className="flex justify-between"><span className="text-stone-500">Account number:</span><strong className="font-mono">{selectedBank.account}</strong></div>
              <div className="flex justify-between"><span className="text-stone-500">Reference used:</span><strong className="font-mono text-amber-700">{orderId}</strong></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
              Bank transfers are verified within 1–2 business hours. Your order will be confirmed once payment is received.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="flex-1 border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl text-sm hover:bg-stone-50">← Back</button>
              <button onClick={() => setStep('processing')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md">Confirm →</button>
            </div>
          </div>
        )}

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          {['🔒 SSL Secured', '🛡️ Fraud Protected', '💯 Official Platform'].map(b => (
            <span key={b} className="text-xs text-stone-400 flex items-center gap-1">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center text-stone-500">Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
