import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LivePriceTicker } from './components/LivePriceTicker';
import { SearchAndHero } from './components/SearchAndHero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { RetailerMatrixModal } from './components/RetailerMatrixModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { VisualSearchModal } from './components/VisualSearchModal';
import { PriceHistoryModal } from './components/PriceHistoryModal';
import { BusinessBlueprintModal } from './components/BusinessBlueprintModal';
import { PRODUCTS } from './data/mockProducts';
import { Product, FilterState, CategoryId } from './types';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, HeartHandshake, Compass, Layers } from 'lucide-react';

export default function App() {
  // Global App States
  const [destination, setDestination] = useState<string>('SG');
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    minPrice: 50,
    maxPrice: 2000,
    onlyShipsToSG: false,
    allInPrice: true, // Default to true as key value prop solving hidden costs!
    selectedBrands: [],
    retailerTypeFilter: 'all',
    sortBy: 'cheapest',
  });

  // Modal States
  const [matrixProduct, setMatrixProduct] = useState<Product | null>(null);
  const [priceHistoryProduct, setPriceHistoryProduct] = useState<Product | null>(null);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [aiAdvisorPrompt, setAiAdvisorPrompt] = useState<string | undefined>(undefined);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isBusinessDeckOpen, setIsBusinessDeckOpen] = useState(false);

  // Brand list for current category
  const availableBrands = useMemo(() => {
    const list = PRODUCTS.filter(
      (p) => filter.category === 'all' || p.category === filter.category
    ).map((p) => p.brand);
    return Array.from(new Set(list));
  }, [filter.category]);

  // Compute effective landed price for sorting and filtering
  const getLandedPrice = (product: Product, allIn: boolean) => {
    const effectivePrices = product.quotes.map((q) => {
      let p = q.basePrice;
      if (allIn) {
        const isFree = q.freeShippingAbove && q.basePrice >= q.freeShippingAbove;
        if (!isFree) p += q.shippingCost;
        if (q.promoCode) {
          if (q.promoCode.discountAmount) p -= q.promoCode.discountAmount;
          else if (q.promoCode.discountPercent) p -= (q.basePrice * q.promoCode.discountPercent) / 100;
        }
      }
      return Math.max(0, p);
    });
    return Math.min(...effectivePrices);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (filter.category !== 'all' && product.category !== filter.category) {
        return false;
      }

      // Search query (name, brand, tags, subcategory)
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesSubcat = product.subcategory.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesSubcat && !matchesTags) {
          return false;
        }
      }

      // Price range
      const bestPrice = getLandedPrice(product, filter.allInPrice);
      if (bestPrice < filter.minPrice || bestPrice > filter.maxPrice) {
        return false;
      }

      // Only ships to SG
      if (filter.onlyShipsToSG) {
        const hasSGQuote = product.quotes.some((q) => q.shipsToSG);
        if (!hasSGQuote) return false;
      }

      // Channel / Retailer type filter
      if (filter.retailerTypeFilter !== 'all') {
        if (filter.retailerTypeFilter === 'online') {
          const hasOnline = product.quotes.some(
            (q) => q.retailerType === 'online_mall' || q.retailerType === 'marketplace'
          );
          if (!hasOnline) return false;
        } else if (filter.retailerTypeFilter === 'offline') {
          const hasOffline = product.quotes.some((q) => q.retailerType === 'offline_chain');
          if (!hasOffline) return false;
        } else if (filter.retailerTypeFilter === 'official') {
          const hasOfficial = product.quotes.some((q) => q.isOfficialStore);
          if (!hasOfficial) return false;
        }
      }

      // Brand filter
      if (filter.selectedBrands.length > 0) {
        if (!filter.selectedBrands.includes(product.brand)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = getLandedPrice(a, filter.allInPrice);
      const priceB = getLandedPrice(b, filter.allInPrice);

      if (filter.sortBy === 'cheapest') {
        return priceA - priceB;
      }
      if (filter.sortBy === 'savings') {
        const savA = a.msrp - priceA;
        const savB = b.msrp - priceB;
        return savB - savA;
      }
      if (filter.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filter.sortBy === 'fastest') {
        const getFastestDays = (p: Product) => {
          const days = p.quotes.map((q) => (q.shipsToSG ? (q.deliveryDays.includes('Next') || q.deliveryDays.includes('Tomorrow') || q.deliveryDays.includes('Same') ? 1 : 2) : 10));
          return Math.min(...days);
        };
        return getFastestDays(a) - getFastestDays(b);
      }
      return 0;
    });
  }, [filter]);

  // Handlers
  const handleOpenAIAdvisor = (prompt?: string) => {
    setAiAdvisorPrompt(prompt);
    setIsAIAdvisorOpen(true);
  };

  const handleApplyAISearch = (keyword: string, category?: CategoryId | null) => {
    setFilter((prev) => ({
      ...prev,
      searchQuery: keyword,
      category: category || prev.category,
    }));
  };

  const handleSelectProductFromTicker = (productId: string) => {
    const p = PRODUCTS.find((item) => item.id === productId);
    if (p) {
      setMatrixProduct(p);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar with Destination & Mode Switches */}
      <Navbar
        onOpenAIAdvisor={() => handleOpenAIAdvisor()}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenBusinessDeck={() => setIsBusinessDeckOpen(true)}
        allInPrice={filter.allInPrice}
        onToggleAllInPrice={() => setFilter((prev) => ({ ...prev, allInPrice: !prev.allInPrice }))}
        destination={destination}
        onChangeDestination={setDestination}
      />

      {/* Real-time Live Price Updates Ribbon */}
      <LivePriceTicker onSelectProduct={handleSelectProductFromTicker} />

      {/* Main Skyscanner Search & Category Console */}
      <SearchAndHero
        searchQuery={filter.searchQuery}
        onSearchChange={(q) => setFilter((prev) => ({ ...prev, searchQuery: q }))}
        selectedCategory={filter.category}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, category: cat }))}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenAIAdvisor={handleOpenAIAdvisor}
        totalProductsCount={PRODUCTS.length}
      />

      {/* Smart Filters Toolbar (Landed Cost, SG Shipping, Price Slider, Sorting) */}
      <FilterBar
        filter={filter}
        onChangeFilter={(updates) => setFilter((prev) => ({ ...prev, ...updates }))}
        availableBrands={availableBrands}
        totalResults={filteredProducts.length}
      />

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No products matched your exact filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting the price range ($50 – $2,000), clearing brand selections, or asking BASKT AI to find similar alternatives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() =>
                  setFilter({
                    category: 'all',
                    searchQuery: '',
                    minPrice: 50,
                    maxPrice: 2000,
                    onlyShipsToSG: false,
                    allInPrice: true,
                    selectedBrands: [],
                    retailerTypeFilter: 'all',
                    sortBy: 'cheapest',
                  })
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => handleOpenAIAdvisor()}
                className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask BASKT AI</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                allInPrice={filter.allInPrice}
                onOpenMatrix={(p) => setMatrixProduct(p)}
                onOpenPriceHistory={(p) => setPriceHistoryProduct(p)}
                destination={destination}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Skyscanner Pitch & Guarantee Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  B
                </div>
                <span className="font-extrabold text-lg text-white">BASKT</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A Price Comparison App for Elevated Everyday Goods ($50 – $2,000) akin to Skyscanner. Live scraping across Shopee Mall, LazMall, Amazon SG, Taobao, Courts, Challenger, and luxury department stores.
              </p>
              <button
                onClick={() => setIsBusinessDeckOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 flex items-center gap-1 mt-2"
              >
                <span>Read Full 10-Slide Pitch Deck & Unit Economics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                5 Curated Merchandise Categories
              </h4>
              <ul className="space-y-1">
                <li>• Electronics (ANC Audio, Mechanical Keyboards, Ergonomic Mice, Espresso)</li>
                <li>• Watches (Automatic Swiss, Japanese GMT, Heritage Field & Smart)</li>
                <li>• Perfumes & Toiletries (Niche Flacons, Aromatherapeutic Care)</li>
                <li>• Branded Bags (Pebble Leather Totes, Commuter Workpacks)</li>
                <li>• Organic Expensive Food (Ceremonial Uji Matcha, Raw Manuka 20+, Truffle)</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                Solving Buyer Problems in Singapore
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Ships to SG Radar:</strong> Never get blindsided by region locks.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>All-In Landed Cost:</strong> Exact freight + tax calculated at checkout.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Retailer Promo Engine:</strong> Automatically factor in hidden store vouchers.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 BASKT Inc. — Skyscanner for Elevated Everyday Goods.</span>
            <span>Target Price Range: &gt;$50 &lt;$2000 SGD</span>
          </div>
        </div>
      </section>

      {/* Skyscanner Retailer Comparison Matrix Modal */}
      <RetailerMatrixModal
        product={matrixProduct}
        onClose={() => setMatrixProduct(null)}
        onOpenPriceHistory={(p) => {
          setMatrixProduct(null);
          setPriceHistoryProduct(p);
        }}
        allInPriceDefault={filter.allInPrice}
        destination={destination}
      />

      {/* AI Assistant Modal (Page 2 Scenario Narrowing) */}
      <AIAssistantModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        initialPrompt={aiAdvisorPrompt}
        onApplySearchKeyword={handleApplyAISearch}
      />

      {/* Visual Search Modal (Page 2 Image Input) */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onApplySearchResult={(q, cat) => {
          setFilter((prev) => ({
            ...prev,
            searchQuery: q,
            category: cat || prev.category,
          }));
        }}
      />

      {/* 30-Day Price Trend & Drop Alerts Modal */}
      <PriceHistoryModal
        product={priceHistoryProduct}
        onClose={() => setPriceHistoryProduct(null)}
      />

      {/* Business Blueprint & Pitch Deck Modal (Pages 1-10) */}
      <BusinessBlueprintModal
        isOpen={isBusinessDeckOpen}
        onClose={() => setIsBusinessDeckOpen(false)}
      />
    </div>
  );
}
