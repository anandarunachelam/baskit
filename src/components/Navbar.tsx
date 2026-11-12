import React from 'react';
import { ShoppingBag, Sparkles, Camera, MapPin, BarChart3, Bell, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenAIAdvisor: (scenarioPrompt?: string) => void;
  onOpenVisualSearch: () => void;
  onOpenBusinessDeck: () => void;
  allInPrice: boolean;
  onToggleAllInPrice: () => void;
  destination: string;
  onChangeDestination: (dest: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAIAdvisor,
  onOpenVisualSearch,
  onOpenBusinessDeck,
  allInPrice,
  onToggleAllInPrice,
  destination,
  onChangeDestination,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro banner for regional buyer status */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE RADAR
          </span>
          <span className="text-slate-300">
            Scanning 18+ Online & Offline retailers for goods between $50 & $2,000
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <button
            onClick={onOpenBusinessDeck}
            className="hover:text-white transition flex items-center gap-1 underline underline-offset-2 text-[11px]"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            View BASKT Blueprint & Pitch Deck
          </button>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Delivering to:</span>
            <select
              value={destination}
              onChange={(e) => onChangeDestination(e.target.value)}
              className="bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="SG">🇸🇬 Singapore (Default)</option>
              <option value="MY">🇲🇾 Malaysia</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GLOBAL">🌐 International</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  BASKT
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Skyscanner for Goods
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Elevated Everyday Goods ($50 – $2,000)
              </p>
            </div>
          </a>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Landed Cost Switch (Problem solution: Separated Shipping Costs) */}
          <button
            onClick={onToggleAllInPrice}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              allInPrice
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Automatically calculates Base Price + SG Shipping - Promo Codes"
          >
            <span className={`w-2 h-2 rounded-full ${allInPrice ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <span>All-In Landed Cost:</span>
            <span className="font-bold">{allInPrice ? 'ON (Net to Door)' : 'OFF (Shelf Price)'}</span>
          </button>

          {/* Visual Search Button (Page 2: Search input by text or image) */}
          <button
            onClick={onOpenVisualSearch}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-200/80"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Visual Search</span>
          </button>

          {/* AI Assistant Button (Page 2: AI assistant suggests features to narrow selection) */}
          <button
            onClick={() => onOpenAIAdvisor()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/25 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Concierge</span>
            <span className="hidden md:inline-block bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
              Narrow Down
            </span>
          </button>

          {/* Mobile Pitch Deck icon */}
          <button
            onClick={onOpenBusinessDeck}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="Business Deck"
          >
            <BarChart3 className="w-5 h-5 text-amber-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
