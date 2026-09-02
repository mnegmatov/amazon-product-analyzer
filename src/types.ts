export interface ProductInput {
  title?: string;
  asin?: string;
  purchasePrice: number | string;
  sellingPrice: number | string;
  amazonFees: number | string;
  fbaFee: number | string;
  shipping: number | string;
}

export interface ProductAnalysisResult {
  profit: number;
  roi: number;
  decision: "BUY" | "DON'T BUY";
  totalCosts: number;
  investment: number;
  profitMargin: number;
  id?: string;
  title?: string;
  asin?: string;
  createdAt?: string;
}

export interface ErrorResponse {
  error: string;
  fields?: Record<string, string>;
}

export interface ProductDimensions {
  length?: number | null;
  width?: number | null;
  height?: number | null;
  unit?: string | null;
}

export interface ProductWeight {
  value?: number | null;
  unit?: string | null;
}

export interface SellingRestrictions {
  isGated?: boolean | null;
  approvalRequired?: boolean | null;
  hazmat?: boolean | null;
  meltable?: boolean | null;
  reasons?: string[] | null;
}

export interface PriceHistoryPoint {
  date: string | number;
  price: number;
  buyBoxPrice?: number | null;
  isAmazon?: boolean | null;
}

export interface ProductData {
  asin: string;
  title?: string | null;
  brand?: string | null;
  category?: string | null;
  currentPrice?: number | null;
  buyBoxPrice?: number | null;
  bsr?: number | null;
  estimatedMonthlySales?: number | null;
  numberOfSellers?: number | null;
  fbaSellers?: number | null;
  fbmSellers?: number | null;
  amazonAsSeller?: boolean | null;
  weight?: number | ProductWeight | null;
  dimensions?: ProductDimensions | string | null;
  sellingRestrictions?: SellingRestrictions | string[] | boolean | null;
  priceHistory?: PriceHistoryPoint[] | null;
}

export interface ProductDataProvider {
  getProductByAsin(asin: string): Promise<ProductData>;
}

export interface FeeCalculationInput {
  product: ProductData;
  sellingPrice: number;
  shipping?: number;
}

export interface FeeBreakdown {
  referralFee: number;
  fbaFee: number;
  variableClosingFee: number;
  totalAmazonFees: number;
  feePercentage: number;
  isMockEstimate: boolean;
  currency: string;
  disclaimer: string;
}

export interface FeeCalculator {
  calculateFees(input: FeeCalculationInput): Promise<FeeBreakdown> | FeeBreakdown;
}
