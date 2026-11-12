import React, { useState } from 'react';
import { Product } from '../types';
import { X, TrendingDown, Bell, Check, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface PriceHistoryModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({ product, onClose }) => {
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(
    product ? Math.round(product.lowestPrice * 0.95) : 100
  );
  const [alertChannel, setAlertChannel] = useState<'email' | 'telegram'>('telegram');
  const [contactInfo, setContactInfo] = useState('');
  const [alertSaved, setAlertSaved] = useState(false);

  if (!product) return null;

  const history = product.priceHistory;
  const minPrice = Math.min(...history.map((p) => p.price));
  const maxPrice = Math.max(...history.map((p) => p.price), product.msrp);
  const range = maxPrice - minPrice || 1;

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSaved(true);
    setTimeout(() => {
      setAlertSaved(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                Live Price Tracking
              </span>
              <span className="text-xs text-slate-400">Updated {product.lastUpdated}</span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white line-clamp-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Price Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Current Best</div>
              <div className="text-lg font-black font-mono text-emerald-700">
                ${product.lowestPrice}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{product.bestRetailer}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Lowest Ever</div>
              <div className="text-lg font-black font-mono text-blue-700">
                ${product.lowestEverPrice}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">Historic Dip</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-500 font-medium">Original MSRP</div>
              <div className="text-lg font-black font-mono text-slate-400 line-through">
                ${product.msrp}
              </div>
              <div className="text-[10px] text-rose-500 font-medium">Retail Tag</div>
            </div>
          </div>

          {/* Price Graph Visualizer (SVG) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-700">30-Day Price Trend</span>
              <span className="text-[11px] text-slate-500">Live Scraped Data</span>
            </div>

            <div className="relative h-44 w-full flex items-end">
              {/* Horizontal Reference Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                <div className="border-b border-dashed border-slate-200 pb-0.5">MSRP: ${maxPrice}</div>
                <div className="border-b border-dashed border-slate-200 pb-0.5">Avg: ${product.averagePrice}</div>
                <div className="border-b border-dashed border-slate-200 pb-0.5">Lowest: ${minPrice}</div>
              </div>

              {/* Data points bar visualization */}
              <div className="relative z-10 w-full flex items-end justify-between px-4 h-32 pt-2">
                {history.map((pt, i) => {
                  const heightPercent = Math.max(15, Math.round(((pt.price - minPrice) / range) * 75 + 15));
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 group relative">
                      <div className="text-[11px] font-mono font-bold text-slate-700 group-hover:text-blue-600">
                        ${pt.price}
                      </div>
                      <div
                        style={{ height: `${heightPercent}px` }}
                        className="w-10 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md group-hover:from-blue-700 group-hover:to-indigo-600 transition shadow-xs"
                      />
                      <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">
                        {pt.date.slice(5)}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[50px]">
                        {pt.retailer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price Drop Alert Form (PDF Page 2 & 5: Telegram / Social Channel Alerts) */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Set Real-Time Price Drop Alert
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              We continuously scrape Shopee, Lazada, Amazon, and Taobao. Get notified the instant the price hits your target!
            </p>

            {alertSaved ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg p-3 text-xs flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Price alert active for ${targetAlertPrice}! We will notify you via {alertChannel}.</span>
              </div>
            ) : (
              <form onSubmit={handleSaveAlert} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Target Price (SGD):</label>
                    <input
                      type="number"
                      value={targetAlertPrice}
                      onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Alert Via:</label>
                    <select
                      value={alertChannel}
                      onChange={(e) => setAlertChannel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="telegram">Telegram (Fastest Deal Push)</option>
                      <option value="email">Email Notification</option>
                    </select>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={alertChannel === 'telegram' ? '@telegram_username or phone' : 'name@example.com'}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition active:scale-95 shadow-sm"
                >
                  Activate BASKT Price Radar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
