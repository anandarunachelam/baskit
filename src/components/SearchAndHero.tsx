import React from 'react';
import { Search, Camera, Sparkles, SlidersHorizontal, ArrowRight, Laptop, Watch, Sparkle, Briefcase, Utensils, CheckCircle2 } from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/mockProducts';

interface SearchAndHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onOpenVisualSearch: () => void;
  onOpenAIAdvisor: (scenarioPrompt?: string) => void;
  totalProductsCount: number;
}

export const SearchAndHero: React.FC<SearchAndHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenVisualSearch,
  onOpenAIAdvisor,
  totalProductsCount,
}) => {
  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'electronics':
        return <Laptop className="w-4 h-4" />;
      case 'watches':
        return <Watch className="w-4 h-4" />;
      case 'perfumes':
        return <Sparkle className="w-4 h-4" />;
      case 'bags':
        return <Briefcase className="w-4 h-4" />;
      case 'food':
        return <Utensils className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const sampleScenarios = [
    { label: '🖱️ "I need a mouse"', prompt: 'I need a mouse, but I am not sure which brand or model to get' },
    { label: '⌚ "Everyday automatic watch"', prompt: 'Looking for an automatic mechanical watch under $800' },
    { label: '✨ "Signature office perfume"', prompt: 'I need a signature perfume for daily work and office meetings' },
    { label: '🎒 "Water-resistant workpack"', prompt: 'I need a durable commuter backpack for a 16-inch laptop' },
    { label: '🍵 "Ceremonial grade matcha"', prompt: 'Recommend the best organic ceremonial matcha from Kyoto' },
  ];

  return (
    <div className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Skyscanner tagline badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Skyscanner for Elevated Everyday Goods
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300">
            Target Price: <strong className="text-white">$50 – $2,000</strong>
          </span>
        </div>

        {/* Hero headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center tracking-tight text-white mb-3">
          Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">Cheapest Price</span> in 1 Click
        </h1>
        <p className="text-center text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-8">
          Compare Shopee, Lazada, Amazon, Taobao, and offline stores across Singapore with real landed shipping costs, official warranties, and auto-applied promo codes.
        </p>

        {/* Skyscanner-style Search Console */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl text-slate-800 border border-white/20">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-100 no-scrollbar">
            <button
              onClick={() => onSelectCategory('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All 5 Categories</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalProductsCount}
              </span>
            </button>

            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Inputs (Text + Visual Image) */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by product name, brand, or feature (e.g. Logitech MX Master, Tissot, Santal 33, Matcha)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Visual Search Trigger */}
            <button
              onClick={onOpenVisualSearch}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 shrink-0"
              title="Search by image upload or photo"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Image Search</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => onOpenAIAdvisor(searchQuery || undefined)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Compare Deals</span>
            </button>
          </div>

          {/* Interactive Feature: Suggestion Scenario from PDF Page 2 */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Need an item but no specific brand?
              </span>
              <span className="hidden lg:inline text-slate-400">BASKT AI suggests features:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {sampleScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenAIAdvisor(sc.prompt)}
                  className="bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200/60 rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition cursor-pointer"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Value Proposition Micro Badges (PDF Page 3) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5">
            <div className="font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              1-Click Cheapest
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Instant multi-retailer matrix</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5">
            <div className="font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Ships to SG Radar
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Solves overseas delivery issues</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5">
            <div className="font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Promo Code Engine
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Considers hidden vouchers</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5">
            <div className="font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              AI Personalisation
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Narrow features like silent vs gaming</div>
          </div>
        </div>
      </div>
    </div>
  );
};
