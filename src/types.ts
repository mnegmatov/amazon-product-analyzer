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
