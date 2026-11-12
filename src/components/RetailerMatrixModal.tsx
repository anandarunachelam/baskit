import React, { useState } from 'react';
import { Product, RetailerQuote } from '../types';
import { X, Check, ExternalLink, ShieldCheck, Truck, Tag, Star, AlertCircle, Sparkles, LineChart, Copy, CheckCheck } from 'lucide-react';

interface RetailerMatrixModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenPriceHistory: (product: Product) => void;
  allInPriceDefault: boolean;
  destination: string;
}

export const RetailerMatrixModal: React.FC<RetailerMatrixModalProps> = ({
  product,
  onClose,
  onOpenPriceHistory,
  allInPriceDefault,
  destination,
}) => {
  const [includeAllIn, setIncludeAllIn] = useState(allInPriceDefault);
  const [appliedCoupons, setAppliedCoupons] = useState<Record<string, boolean>>({
    shopee: true,
    lazada: true,
    amazon_sg: true,
    farfetch: true,
    ishopchangi: true,
    taobao: true,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!product) return null;

  const toggleCoupon = (retailerId: string) => {
    setAppliedCoupons((prev) => ({
      ...prev,
      [retailerId]: !prev[retailerId],
    }));
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const calculateTotal = (quote: RetailerQuote) => {
    let total = quote.basePrice;
    if (includeAllIn) {
      // Add shipping
      const isFreeShipping = quote.freeShippingAbove && quote.basePrice >= quote.freeShippingAbove;
      if (!isFreeShipping) {
        total += quote.shippingCost;
      }
      // Apply coupon if toggled on
      const isApplied = appliedCoupons[quote.retailerId] ?? true;
      if (isApplied && quote.promoCode) {
        if (quote.promoCode.discountAmount) {
          total -= quote.promoCode.discountAmount;
        } else if (quote.promoCode.discountPercent) {
          total -= (quote.basePrice * quote.promoCode.discountPercent) / 100;
        }
      }
    }
    return Math.max(0, Math.round(total * 100) / 100);
  };

  // Sort quotes by calculated total
  const sortedQuotes = [...product.quotes].sort((a, b) => calculateTotal(a) - calculateTotal(b));
  const cheapestTotal = calculateTotal(sortedQuotes[0]);
  const mostExpensiveTotal = calculateTotal(sortedQuotes[sortedQuotes.length - 1]);
  const potentialSavings = Math.round(mostExpensiveTotal - cheapestTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-white/20 shrink-0 bg-white"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {product.brand}
                </span>
                <span className="text-[11px] text-slate-400">
                  Category: {product.category.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {product.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                <span>MSRP: <strong className="text-slate-100">${product.msrp}</strong></span>
                <span>•</span>
                <span>Best Landed: <strong className="text-emerald-400 font-mono text-sm">${cheapestTotal}</strong></span>
                {potentialSavings > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded">
                      Save up to ${potentialSavings} across retailers
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Control Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAllIn}
                onChange={(e) => setIncludeAllIn(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Calculate All-In Landed Cost (Base + Shipping - Promo Codes)</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPriceHistory(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg transition"
            >
              <LineChart className="w-3.5 h-3.5 text-blue-600" />
              <span>30-Day Price Trend</span>
            </button>
          </div>
        </div>

        {/* Retailer Comparison Table (Skyscanner UX) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Comparing {sortedQuotes.length} Online & Offline Retailers</span>
            <span>Destination: {destination === 'SG' ? '🇸🇬 Singapore' : destination}</span>
          </div>

          {sortedQuotes.map((quote, index) => {
            const isLowest = index === 0;
            const isCouponApplied = appliedCoupons[quote.retailerId] ?? true;
            const total = calculateTotal(quote);
            const isFreeShipping = quote.freeShippingAbove && quote.basePrice >= quote.freeShippingAbove;

            return (
              <div
                key={quote.retailerId}
                className={`rounded-xl border p-4 transition ${
                  isLowest
                    ? 'border-emerald-300 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-400/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Retailer Info & Trust Badges */}
                  <div className="space-y-1.5 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {quote.originCountry === 'SG' ? '🇸🇬' : quote.originCountry === 'JP' ? '🇯🇵' : quote.originCountry === 'US' ? '🇺🇸' : quote.originCountry === 'CN' ? '🇨🇳' : '🇪🇺'}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {quote.retailerName}
                      </h4>
                      {isLowest && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs">
                          Cheapest Deal
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <strong>{quote.sellerRating}</strong> ({quote.reviewCount.toLocaleString()})
                      </span>
                      <span>•</span>
                      <span className="capitalize text-slate-500 font-medium">
                        {quote.retailerType.replace('_', ' ')}
                      </span>
                      {quote.isOfficialStore && (
                        <>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Official Flagship
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Non-Price Results (Warranty, Shipping, Return Policy) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-100 min-w-[280px]">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-semibold">{quote.shipsToSG ? 'Ships to SG' : 'No SG Shipping'}: </span>
                        <span>{quote.deliveryDays}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{quote.warranty}</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-500">
                      <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Return: {quote.returnPolicy}</span>
                    </div>

                    {/* Promo code badge & interactive toggle */}
                    {quote.promoCode && (
                      <div className="sm:col-span-2 flex items-center justify-between gap-2 bg-indigo-50/80 border border-indigo-200/80 px-2.5 py-1 rounded-md text-indigo-900 mt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Tag className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <button
                            onClick={() => copyCodeToClipboard(quote.promoCode!.code)}
                            className="font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-indigo-300 text-[11px] hover:bg-indigo-100 flex items-center gap-1 transition"
                            title="Click to copy code"
                          >
                            <span>{quote.promoCode.code}</span>
                            {copiedCode === quote.promoCode.code ? (
                              <CheckCheck className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                          <span className="text-[11px] text-indigo-700 truncate">
                            {quote.promoCode.description}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleCoupon(quote.retailerId)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                            isCouponApplied
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-indigo-600 border border-indigo-300'
                          }`}
                        >
                          {isCouponApplied ? '✓ Applied' : '+ Apply'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price breakdown & 1-Click Buy Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-right">
                      {includeAllIn ? (
                        <>
                          <div className="text-[11px] text-slate-500">
                            Base: ${quote.basePrice}
                            {quote.shippingCost > 0 && !isFreeShipping && (
                              <span> + ${quote.shippingCost} ship</span>
                            )}
                            {isFreeShipping && <span className="text-emerald-600 font-medium"> (Free ship)</span>}
                            {quote.promoCode && isCouponApplied && (
                              <span className="text-indigo-600 font-medium"> - promo</span>
                            )}
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                            ${total}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            Landed Net Price
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] text-slate-500">Shelf Price</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                            ${quote.basePrice}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            + {quote.shippingCost === 0 || isFreeShipping ? 'Free shipping' : `$${quote.shippingCost} ship`}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Outbound 1-Click Deal Button */}
                    <a
                      href={quote.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition active:scale-95 ${
                        isLowest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>Go to Store</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note solving problems from PDF Page 4 */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 sm:px-6 py-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>BASKT Transparency:</strong> Prices are live-verified. Retailer coupons and landed SG freight are calculated automatically.
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
