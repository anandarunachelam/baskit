import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Users, Megaphone, Server, ShieldAlert, Sparkles, Building2, Layers, Target, Compass } from 'lucide-react';

interface BusinessBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessBlueprintModal: React.FC<BusinessBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'revenue' | 'channels'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                SLIDE DECK & BLUEPRINT
              </span>
              <span className="text-xs text-slate-400">PDF Attachment Strategy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              BASKT Business & Architecture Model
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              A Price Comparison App for Elevated Everyday Goods ($50 – $2,000) Akin to Skyscanner
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs matching PDF sections */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Core Model & Value Props
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'problems'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Problems & Solutions (Page 4)
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Costs & Revenue Streams (Pages 7-8)
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'channels'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Channels & Segments (Pages 5-6, 9)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-1.5">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>The Product Concept (Page 2 & 10)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>BASKT</strong> is a price comparison app akin to Skyscanner, purpose-built for elevated consumer goods rather than cheap groceries or flight tickets. Focuses exclusively on merchandise in the <strong>$50 to $2,000 range</strong> across 5 curated categories.
                  </p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>AI Feature Narrowing (Page 2)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Solves the discovery roadblock: when users know what item they need (e.g. mouse, watch, perfume) but have no specific brand or model in mind, the <strong>BASKT AI Concierge</strong> suggests attributes (silent vs gaming, mechanical vs quartz) to narrow down to the ideal product.
                  </p>
                </div>
              </div>

              {/* 5 Categories from Page 1 */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  5 Core Product Categories (Rough Target Price: &gt;$50, &lt;$2000)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-800">1. Electronics</div>
                    <div className="text-[10px] text-slate-500">Mice, audio, ANC, espresso</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-800">2. Watches</div>
                    <div className="text-[10px] text-slate-500">Automatic, dive, GMT, dress</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-800">3. Perfumes</div>
                    <div className="text-[10px] text-slate-500">Niche EDPs, luxury toiletries</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-800">4. Branded Bags</div>
                    <div className="text-[10px] text-slate-500">Leather totes, workpacks</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <div className="font-bold text-slate-800">5. Organic Food</div>
                    <div className="text-[10px] text-slate-500">Matcha, Manuka 20+, Truffle</div>
                  </div>
                </div>
              </div>

              {/* Key Value Propositions (Page 3) */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Value Propositions (Page 3)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">1-Click Cheapest</div>
                      <div className="text-[11px] text-slate-500">Find lowest price instantly</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Fast & Simple</div>
                      <div className="text-[11px] text-slate-500">Zero clunky navigation</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Appealing to Users</div>
                      <div className="text-[11px] text-slate-500">Clean modern aesthetics</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Intuitive & Friendly</div>
                      <div className="text-[11px] text-slate-500">User-centric design</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Personalized Advice</div>
                      <div className="text-[11px] text-slate-500">AI scenario guidance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Real-Live Updates</div>
                      <div className="text-[11px] text-slate-500">Live price radar ticker</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="space-y-4">
              <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 font-medium">
                The attachment identifies three specific friction points that break conventional price comparison engines. BASKT directly solves all three:
              </div>

              {/* Problem 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Problem: "Product may not ship to SG - how to tell?"
                  </h4>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>BASKT Solution: Singapore Delivery Verification Radar</span>
                  </div>
                  <p className="text-emerald-800">
                    Every retailer listing features a validated SG Delivery indicator showing transit days (e.g. "🇸🇬 1-2 Days Local", "✈️ 3-4 Days Express Air"), with a global toggle to immediately filter out items that don't ship to Singapore.
                  </p>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Problem: "Shipping Costs are separated."
                  </h4>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>BASKT Solution: All-In Landed Cost Calculator</span>
                  </div>
                  <p className="text-emerald-800">
                    Users can toggle <strong>All-In Landed Cost</strong> mode with 1 click. BASKT calculates Base Shelf Price + Exact Shipping Fee (or $0 if free shipping threshold is met), so the buyer sees the true out-of-pocket price.
                  </p>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">3</span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Problem: "Retailers have their own promo codes not considered in the price result."
                  </h4>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>BASKT Solution: Integrated Retailer Promo Code Engine</span>
                  </div>
                  <p className="text-emerald-800">
                    BASKT aggregates active store vouchers (e.g. Shopee Mall vouchers, Lazada bank codes, Farfetch 10% promo) and automatically applies them into the net comparison price with 1-click copy codes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-4">
              {/* Cost Structure (Page 7) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Cost Structure (Page 7)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-700">SW Developer Costs</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Scraper engineering, full-stack app</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-700">AWS Cloud Services</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Scraping infra, DB, headless browsers</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-300 bg-emerald-50/50">
                    <div className="font-bold text-emerald-800">Runway Budget</div>
                    <div className="text-sm font-black font-mono text-emerald-900 mt-0.5">$30k over 6 months</div>
                  </div>
                </div>
              </div>

              {/* Revenue Streams (Page 8) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Revenue Streams (Page 8)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">1. Affiliate Marketing</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Referral commissions (2%–8% on GMV for elevated goods $50–$2,000 via Shopee, Amazon, Lazada, Farfetch affiliate programs).
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">2. Cost-Per-Click (CPC)</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Referral fee paid by retailers for qualified buyer outbound clicks directly to product pages.
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">3. Advertising & Recommendation</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Featured brand placements, sponsored product comparisons, and premium retailer badges.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-4">
              {/* Customer Segments (Page 6) */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Target Customer Segments (Page 6)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Middle-to-Upper Products</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Mass market purchasing goods in the $50–$2,000 tier (not bottom-dollar $2 items, but elevated essentials).
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Low to Middle Income</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Aspirant buyers seeking the maximum mileage, discounts, and genuine deals for high-ticket purchases.
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Value-Driven Conscious</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Discerning shoppers who compare warranty, authenticity, and return policies alongside price.
                    </div>
                  </div>
                </div>
              </div>

              {/* Channels (Page 5) */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  <span>Acquisition Channels (Page 5)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Direct</div>
                    <div className="text-[11px] text-slate-500 mt-1">BASKT Homepage & PWA browser bookmarks.</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Tech & Lifestyle Media</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Mothership SG, HardwareZone Forums, Google SEO, and ChatGPT search referrals.
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-bold text-slate-800">Social Media & Alerts</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Instagram, TikTok, Facebook, and real-time Telegram Deal Broadcasts.
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Resources (Page 9) */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Key Resources (Page 9)</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-800">Online Retailers & Brand.com:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Shopee Mall</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">LazMall</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Amazon SG & US</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Taobao / Tmall</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Apple Store</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">iShopChangi</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Sephora</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Farfetch</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Chrono24</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-800">Offline Retailers & Brand Outlets:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Courts</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Challenger</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Best Denki</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Takashimaya</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Tangs</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Harvey Norman</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">FairPrice Finest</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <strong>Product Intelligence Engine:</strong> Deep product taxonomy with semantic brand/feature matching and comparable alternative discovery.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
          >
            Back to BASKT Search
          </button>
        </div>
      </div>
    </div>
  );
};
