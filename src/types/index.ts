export type CategoryId = 'electronics' | 'watches' | 'perfumes' | 'bags' | 'food';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export type RetailerType = 'online_mall' | 'brand_direct' | 'offline_chain' | 'marketplace' | 'cross_border';

export interface RetailerQuote {
  retailerId: string;
  retailerName: string;
  logo: string;
  retailerType: RetailerType;
  basePrice: number;
  currency: string;
  shippingCost: number;
  freeShippingAbove?: number;
  shipsToSG: boolean;
  deliveryDays: string;
  originCountry: string; // 'SG', 'US', 'JP', 'CN', 'UK', 'FR'
  warranty: string;
  returnPolicy: string;
  sellerRating: number;
  reviewCount: number;
  inStock: boolean;
  isOfficialStore: boolean;
  promoCode?: {
    code: string;
    description: string;
    discountAmount?: number; // fixed discount in SGD
    discountPercent?: number; // % discount
    minSpend?: number;
  };
  affiliateUrl: string;
}

export interface PricePoint {
  date: string;
  price: number;
  retailer: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  subcategory: string;
  image: string;
  description: string;
  tags: string[];
  msrp: number;
  lowestPrice: number;
  highestPrice: number;
  bestRetailer: string;
  quotes: RetailerQuote[];
  priceHistory: PricePoint[];
  lowestEverPrice: number;
  averagePrice: number;
  rating: number;
  totalReviews: number;
  lastUpdated: string;
}

export interface FilterState {
  category: CategoryId | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  onlyShipsToSG: boolean;
  allInPrice: boolean; // Add shipping & subtract auto-applied coupons
  selectedBrands: string[];
  retailerTypeFilter: string; // 'all' | 'offline' | 'online' | 'official'
  sortBy: 'cheapest' | 'savings' | 'rating' | 'fastest';
}

export interface LivePriceAlert {
  id: string;
  productId: string;
  productName: string;
  retailer: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
  discountBadge: string;
}
