import { ProductData } from '../types.ts';

/**
 * Abstraction/Interface for Amazon product data providers.
 * Future implementations (e.g. AmazonProductProvider, KeepaProductProvider)
 * will implement this interface.
 */
export interface ProductDataProvider {
  /**
   * Retrieves Amazon product data by ASIN.
   * @param asin - 10-character Amazon Standard Identification Number
   * @returns Promise resolving to ProductData
   */
  getProductByAsin(asin: string): Promise<ProductData>;
}

export type { ProductData };
export { MockProductDataProvider } from './mockProductDataProvider.ts';
