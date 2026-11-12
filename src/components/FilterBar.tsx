import React from 'react';
import { Filter, ArrowUpDown, DollarSign, ShieldCheck, Truck, Tag, RefreshCcw } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filter: FilterState;
  onChangeFilter: (newFilter: Partial<FilterState>) => void;
  availableBrands: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  availableBrands,
  totalResults,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Results Count & Core Smart Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            {totalResults} {totalResults === 1 ? 'Product' : 'Products'} Found
          </div>

          {/* Quick Problem Solution 1: Ships to SG Toggle */}
          <button
            onClick={() => onChangeFilter({ onlyShipsToSG: !filter.onlyShipsToSG })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              filter.onlyShipsToSG
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Filter out products requiring freight forwarding to Singapore"
          >
            <Truck className={`w-3.5 h-3.5 ${filter.onlyShipsToSG ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Ships to SG Verified</span>
            {filter.onlyShipsToSG && <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">ACTIVE</span>}
          </button>

          {/* Quick Problem Solution 2: All-In Landed Cost Toggle */}
          <button
            onClick={() => onChangeFilter({ allInPrice: !filter.allInPrice })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              filter.allInPrice
                ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Calculate Total Landed Cost (Base + Shipping - Promo Codes)"
          >
            <Tag className={`w-3.5 h-3.5 ${filter.allInPrice ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Include Shipping & Coupons</span>
            {filter.allInPrice && <span className="text-[10px] bg-blue-200 text-blue-900 px-1 rounded font-bold">ALL-IN</span>}
          </button>

          {/* Channel / Store Type Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden lg:inline">Channel:</span>
            <select
              value={filter.retailerTypeFilter}
              onChange={(e) => onChangeFilter({ retailerTypeFilter: e.target.value })}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Retailers (Online & Offline)</option>
              <option value="online">Online Malls (Shopee, Laz, Amazon)</option>
              <option value="offline">Offline Stores (Takashimaya, Courts, Tangs)</option>
              <option value="official">Official Flagships Only</option>
            </select>
          </div>
        </div>

        {/* Right side: Price Range Slider & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Target Price Range Indicator ($50 - $2000 from PDF) */}
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
            <span className="text-slate-500 font-medium">Price:</span>
            <span className="font-bold text-slate-800">
              ${filter.minPrice} – ${filter.maxPrice}
            </span>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={filter.maxPrice}
              onChange={(e) => onChangeFilter({ maxPrice: Number(e.target.value) })}
              className="w-24 accent-blue-600 cursor-pointer"
              title={`Max Price: $${filter.maxPrice}`}
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filter.sortBy}
              onChange={(e) => onChangeFilter({ sortBy: e.target.value as any })}
              className="bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="cheapest">Sort: Cheapest First (1-Click)</option>
              <option value="savings">Sort: Highest Savings vs MSRP</option>
              <option value="rating">Sort: Highest Customer Rating</option>
              <option value="fastest">Sort: Fastest SG Delivery</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(filter.searchQuery ||
            filter.category !== 'all' ||
            filter.maxPrice < 2000 ||
            filter.minPrice > 50 ||
            filter.onlyShipsToSG ||
            filter.selectedBrands.length > 0) && (
            <button
              onClick={() =>
                onChangeFilter({
                  category: 'all',
                  searchQuery: '',
                  minPrice: 50,
                  maxPrice: 2000,
                  onlyShipsToSG: false,
                  selectedBrands: [],
                  retailerTypeFilter: 'all',
                  sortBy: 'cheapest',
                })
              }
              className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
              title="Reset all filters"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Brand Filter Pills if available */}
      {availableBrands.length > 0 && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-medium text-slate-400 shrink-0">Popular Brands:</span>
          {availableBrands.slice(0, 10).map((brand) => {
            const isSelected = filter.selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                onClick={() => {
                  const updated = isSelected
                    ? filter.selectedBrands.filter((b) => b !== brand)
                    : [...filter.selectedBrands, brand];
                  onChangeFilter({ selectedBrands: updated });
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
