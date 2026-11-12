import React, { useState, useEffect } from 'react';
import { TrendingDown, Zap, Clock, ChevronRight } from 'lucide-react';
import { LIVE_PRICE_ALERTS } from '../data/mockProducts';

interface LivePriceTickerProps {
  onSelectProduct: (productId: string) => void;
}

export const LivePriceTicker: React.FC<LivePriceTickerProps> = ({ onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_PRICE_ALERTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeAlert = LIVE_PRICE_ALERTS[currentIndex];

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-b border-amber-200/60 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center gap-1 font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded text-[11px] shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            LIVE PRICE RADAR
          </span>

          <div
            onClick={() => onSelectProduct(activeAlert.productId)}
            className="flex items-center gap-2 truncate cursor-pointer hover:underline text-slate-800 font-medium transition"
          >
            <span className="truncate">{activeAlert.productName}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 hidden sm:inline">{activeAlert.retailer}</span>
            <span className="line-through text-slate-400 hidden sm:inline">${activeAlert.oldPrice}</span>
            <span className="font-bold text-emerald-700">${activeAlert.newPrice}</span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
              <TrendingDown className="w-3 h-3 text-emerald-600" />
              {activeAlert.discountBadge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-slate-500">
          <div className="hidden md:flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Updated {activeAlert.timestamp}</span>
          </div>
          <button
            onClick={() => onSelectProduct(activeAlert.productId)}
            className="flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 transition text-[11px]"
          >
            <span>Compare Now</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
