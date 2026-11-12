import React from 'react';
import { Product, RetailerQuote } from '../types';
import { Star, Truck, ShieldCheck, Tag, ExternalLink, ArrowRight, LineChart, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  allInPrice: boolean;
  onOpenMatrix: (product: Product) => void;
  onOpenPriceHistory: (product: Product) => void;
  destination: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  allInPrice,
  onOpenMatrix,
  onOpenPriceHistory,
  destination,
}) => {
  // Helper to compute effective price for a quote
  const getEffectivePrice = (quote: RetailerQuote) => {
    let price = quote.basePrice;
    if (allInPrice) {
      // Add shipping
      const isFreeShipping = quote.freeShippingAbove && quote.basePrice >= quote.freeShippingAbove;
      if (!isFreeShipping) {
        price += quote.shippingCost;
      }
      // Deduct coupon discount
      if (quote.promoCode) {
        if (quote.promoCode.discountAmount) {
          price -= quote.promoCode.discountAmount;
        } else if (quote.promoCode.discountPercent) {
          price -= (quote.basePrice * quote.promoCode.discountPercent) / 100;
        }
      }
    }
    return Math.max(0, Math.round(price * 100) / 100);
  };

  // Find lowest quote based on current mode
  const sortedQuotes = [...product.quotes].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  const bestQuote = sortedQuotes[0];
  const lowestPrice = getEffectivePrice(bestQuote);
  const highestPrice = getEffectivePrice(sortedQuotes[sortedQuotes.length - 1]);
  const savings = Math.max(0, Math.round(product.msrp - lowestPrice));
  const savingsPercent = Math.round((savings / product.msrp) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Product Image & Top Badges */}
      <div className="relative h-56 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Brand & Subcategory Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {product.brand}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {product.subcategory}
          </span>
        </div>

        {/* Price History Shortcut icon button */}
        <button
          onClick={() => onOpenPriceHistory(product)}
          className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-lg shadow-sm transition"
          title="View 30-day Price History & Drop Alerts"
        >
          <LineChart className="w-4 h-4" />
        </button>

        {/* Savings Ribbon */}
        {savings > 0 && (
          <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <span>Save ${savings}</span>
            <span className="text-emerald-200 text-[10px]">({savingsPercent}% OFF)</span>
          </div>
        )}

        {/* Live sync badge */}
        <div className="absolute bottom-3 right-3 text-[10px] text-white/90 font-medium bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
          Updated {product.lastUpdated}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Review info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span>({product.totalReviews.toLocaleString()} reviews)</span>
            </div>
            <span className="text-[11px] text-slate-400">MSRP: ${product.msrp}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenMatrix(product)}
            className="font-bold text-slate-900 text-base line-clamp-2 hover:text-blue-600 transition cursor-pointer mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Value proposition details (Warranty, SG Shipping, Promo) */}
          <div className="space-y-1.5 mb-4 text-xs">
            {/* Singapore Shipping status */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium">
                {bestQuote.shipsToSG ? (
                  <span className="text-emerald-700 font-semibold">
                    Ships to {destination}: {bestQuote.deliveryDays}
                  </span>
                ) : (
                  <span className="text-amber-700">Overseas Forwarder required</span>
                )}
              </span>
            </div>

            {/* Official Warranty / Authenticity */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{bestQuote.warranty}</span>
            </div>

            {/* Promo Code tag */}
            {bestQuote.promoCode && (
              <div className="flex items-center gap-1.5 text-indigo-700 font-medium">
                <Tag className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>
                  Code: <strong className="font-mono bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">{bestQuote.promoCode.code}</strong>{' '}
                  ({bestQuote.promoCode.description})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skyscanner-Style Retailer Comparison Preview Matrix */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Compare {product.quotes.length} Retailers:</span>
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer" onClick={() => onOpenMatrix(product)}>
              View All
            </span>
          </div>

          <div className="space-y-1.5 mb-4">
            {sortedQuotes.slice(0, 3).map((quote, idx) => {
              const effPrice = getEffectivePrice(quote);
              const isLowest = idx === 0;

              return (
                <div
                  key={quote.retailerId}
                  onClick={() => onOpenMatrix(product)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                    isLowest
                      ? 'bg-emerald-50/80 border border-emerald-200 text-slate-900 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[10px] overflow-hidden">
                      {quote.originCountry === 'SG' ? '🇸🇬' : quote.originCountry === 'JP' ? '🇯🇵' : quote.originCountry === 'US' ? '🇺🇸' : quote.originCountry === 'CN' ? '🇨🇳' : '🌐'}
                    </span>
                    <span className="truncate text-[12px]">{quote.retailerName}</span>
                    {isLowest && (
                      <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">
                        Cheapest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono font-bold ${isLowest ? 'text-emerald-700' : 'text-slate-800'}`}>
                      ${effPrice}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary & 1-Click Action Buttons */}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div>
              <div className="text-[11px] text-slate-500">
                {allInPrice ? 'All-in Landed from:' : 'Base shelf price from:'}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ${lowestPrice}
                </span>
                {product.quotes.length > 1 && highestPrice > lowestPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${highestPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Skyscanner 1-Click Comparison CTA */}
            <button
              onClick={() => onOpenMatrix(product)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition active:scale-95"
            >
              <span>Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
