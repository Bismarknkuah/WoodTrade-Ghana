'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'quality_check',
  'ready_for_shipping',
  'shipped',
  'customs_clearance',
  'delivered',
];

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  quality_check: 'Quality Check',
  ready_for_shipping: 'Ready to Ship',
  shipped: 'Shipped',
  customs_clearance: 'Customs Clearance',
  delivered: 'Delivered',
};

const statusIcons: Record<string, string> = {
  pending: '⏳',
  confirmed: '✅',
  processing: '⚙️',
  quality_check: '🔍',
  ready_for_shipping: '📦',
  shipped: '🚢',
  customs_clearance: '🛃',
  delivered: '🎉',
};

const mockOrder = {
  orderNumber: 'WTG-ORD-00000001',
  status: 'shipped',
  buyer: 'Timber USA Inc.',
  seller: 'Ashanti Forest Products Ltd.',
  items: [{ name: 'Premium Odum Timber (Iroko)', quantity: 10, unit: 'm³' }],
  destination: 'Los Angeles, USA',
  totalGHS: 84000,
  totalUSD: 5753,
  trackingNumber: 'MSC-GH-2024-88712',
  carrier: 'MSC Mediterranean Shipping',
  vessel: 'MSC Accra',
  eta: '2025-02-14',
  placedDate: '2025-01-15',
  events: [
    { status: 'pending', date: '2025-01-15', note: 'Order placed by buyer' },
    { status: 'confirmed', date: '2025-01-16', note: 'Order confirmed by Ashanti Forest Products' },
    { status: 'processing', date: '2025-01-17', note: 'Timber being prepared and packed' },
    { status: 'quality_check', date: '2025-01-20', note: 'WoodTrade QC inspection completed' },
    { status: 'ready_for_shipping', date: '2025-01-22', note: 'Container loaded at Tema Port' },
    { status: 'shipped', date: '2025-01-25', note: 'Vessel departed Tema Port, Ghana' },
  ],
};

export default function TrackOrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = use(params);
  const order = mockOrder;
  const currentIndex = ORDER_STATUSES.indexOf(order.status);
  const progressPct = Math.round((currentIndex / (ORDER_STATUSES.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-[#5a3e2b] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-amber-400 text-sm hover:underline mb-3 inline-block">
            ← WoodTrade Ghana
          </Link>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Order Tracking
          </h1>
          <div className="font-mono text-amber-200">{order.orderNumber}</div>
          <div className="text-amber-300 text-xs mt-1 opacity-70">#{orderNumber}</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{statusIcons[order.status]}</div>
            <div>
              <div className="text-sm text-stone-500 mb-1">Current Status</div>
              <div className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
                {statusLabels[order.status]}
              </div>
              {order.status === 'shipped' && (
                <div className="text-sm text-amber-700 font-semibold mt-1">
                  ETA: {order.eta} • {order.carrier}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-5">Shipment Progress</h3>
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-1 bg-stone-200 rounded-full" />
            <div
              className="absolute top-4 left-4 h-1 bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, right: 'auto' }}
            />
            <div className="flex justify-between relative">
              {ORDER_STATUSES.map((s, i) => {
                const done = i <= currentIndex;
                const current = i === currentIndex;
                return (
                  <div key={s} className="flex flex-col items-center gap-2" style={{ width: '12.5%' }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 z-10 transition-all ${done ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-stone-300 text-stone-400'} ${current ? 'ring-4 ring-amber-200 scale-110' : ''}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs text-center leading-tight ${done ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                      {statusLabels[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
            <h3 className="font-bold text-stone-800 mb-4">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Tracking No.', order.trackingNumber],
                ['Carrier', order.carrier],
                ['Vessel', order.vessel],
                ['Destination', order.destination],
                ['ETA', order.eta],
                ['Placed On', order.placedDate],
              ].map(([k, v]) => (
                <div key={k} className="bg-stone-50 rounded-lg p-3">
                  <div className="text-stone-400 text-xs mb-0.5">{k}</div>
                  <div className="font-semibold text-stone-900 text-sm">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-5">Event Timeline</h3>
          <div className="space-y-4">
            {[...order.events].reverse().map((e, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-lg shrink-0">
                    {statusIcons[e.status]}
                  </div>
                  {i < order.events.length - 1 && (
                    <div className="w-0.5 bg-amber-200 flex-1 mt-1" style={{ minHeight: '12px' }} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-stone-900 text-sm">{statusLabels[e.status]}</span>
                    <span className="text-stone-400 text-xs">{e.date}</span>
                  </div>
                  <p className="text-stone-600 text-sm">{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-4">Order Summary</h3>
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-2.5 text-stone-700">{item.name}</td>
                  <td className="py-2.5 text-stone-500 text-right">{item.quantity} {item.unit}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-bold text-stone-900">Total</td>
                <td className="py-3 font-bold text-stone-900 text-right">
                  GHS {order.totalGHS.toLocaleString()}
                  <span className="text-stone-400 font-normal text-xs ml-1">(${order.totalUSD.toLocaleString()} USD)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}