import { ProductData, ProductDataProvider } from '../types.ts';

/**
 * ============================================================================
 * MOCK PRODUCT DATA PROVIDER (FOR DEVELOPMENT / TESTING ONLY)
 * ============================================================================
 * NOTE: All data returned by this provider is synthetic/simulated mock data.
 * It is NOT fetched from live Amazon APIs or Keepa.
 * ============================================================================
 */

/** Predefined realistic mock catalog for specific test ASINs */
const MOCK_CATALOG: Record<string, Partial<ProductData>> = {
  B08XYZ1234: {
    title: '[MOCK] Ergonomic Wireless Mouse (Silent Click, 2.4G)',
    brand: 'TechGrip (Mock Brand)',
    category: 'Electronics > Computers & Accessories > Keyboards & Mice',
    currentPrice: 19.99,
    buyBoxPrice: 19.99,
    bsr: 1450,
    estimatedMonthlySales: 620,
    numberOfSellers: 6,
    fbaSellers: 4,
    fbmSellers: 2,
    amazonAsSeller: false,
    weight: { value: 0.32, unit: 'lbs' },
    dimensions: { length: 4.6, width: 2.7, height: 1.5, unit: 'inches' },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: [],
    },
    priceHistory: [
      { date: '2026-08-01', price: 21.99, buyBoxPrice: 21.99, isAmazon: false },
      { date: '2026-08-15', price: 19.99, buyBoxPrice: 19.99, isAmazon: false },
      { date: '2026-09-01', price: 19.99, buyBoxPrice: 19.99, isAmazon: false },
    ],
  },
  B07ABC9876: {
    title: '[MOCK] Stainless Steel Insulated Water Bottle 750ml',
    brand: 'HydroSteel (Mock Brand)',
    category: 'Sports & Outdoors > Water Bottles',
    currentPrice: 19.99,
    buyBoxPrice: 19.99,
    bsr: 12500,
    estimatedMonthlySales: 95,
    numberOfSellers: 14,
    fbaSellers: 9,
    fbmSellers: 5,
    amazonAsSeller: false,
    weight: { value: 0.85, unit: 'lbs' },
    dimensions: { length: 10.5, width: 3.2, height: 3.2, unit: 'inches' },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: [],
    },
    priceHistory: [
      { date: '2026-08-01', price: 24.99, buyBoxPrice: 24.99, isAmazon: false },
      { date: '2026-08-20', price: 19.99, buyBoxPrice: 19.99, isAmazon: false },
    ],
  },
  B09LMN4567: {
    title: '[MOCK] Premium Silicone Kitchen Utensils Set (10-Piece)',
    brand: 'ChefCraft (Mock Brand)',
    category: 'Home & Kitchen > Kitchen Utensils & Gadgets',
    currentPrice: 29.99,
    buyBoxPrice: 29.99,
    bsr: 5400,
    estimatedMonthlySales: 280,
    numberOfSellers: 4,
    fbaSellers: 3,
    fbmSellers: 1,
    amazonAsSeller: false,
    weight: { value: 1.45, unit: 'lbs' },
    dimensions: { length: 13.0, width: 4.5, height: 4.5, unit: 'inches' },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: [],
    },
    priceHistory: [
      { date: '2026-08-01', price: 32.99, buyBoxPrice: 32.99, isAmazon: false },
      { date: '2026-08-25', price: 29.99, buyBoxPrice: 29.99, isAmazon: false },
    ],
  },
};

/**
 * Mock implementation of ProductDataProvider for local development and testing.
 */
export class MockProductDataProvider implements ProductDataProvider {
  /**
   * Returns mock product details for a given ASIN.
   * @param asin - Amazon ASIN (e.g. "B08XYZ1234")
   */
  async getProductByAsin(asin: string): Promise<ProductData> {
    const normalizedAsin = (asin || '').trim().toUpperCase();

    // Check predefined mock items first
    const knownMock = MOCK_CATALOG[normalizedAsin];
    if (knownMock) {
      return {
        asin: normalizedAsin,
        title: knownMock.title ?? `[MOCK] Product ${normalizedAsin}`,
        brand: knownMock.brand ?? 'Generic Mock Brand',
        category: knownMock.category ?? 'General Merchandise',
        currentPrice: knownMock.currentPrice ?? 19.99,
        buyBoxPrice: knownMock.buyBoxPrice ?? 19.99,
        bsr: knownMock.bsr ?? 5000,
        estimatedMonthlySales: knownMock.estimatedMonthlySales ?? 300,
        numberOfSellers: knownMock.numberOfSellers ?? 5,
        fbaSellers: knownMock.fbaSellers ?? 3,
        fbmSellers: knownMock.fbmSellers ?? 2,
        amazonAsSeller: knownMock.amazonAsSeller ?? false,
        weight: knownMock.weight ?? { value: 0.5, unit: 'lbs' },
        dimensions: knownMock.dimensions ?? { length: 6.0, width: 4.0, height: 2.0, unit: 'inches' },
        sellingRestrictions: knownMock.sellingRestrictions ?? {
          isGated: false,
          approvalRequired: false,
          hazmat: false,
          meltable: false,
          reasons: [],
        },
        priceHistory: knownMock.priceHistory ?? [
          { date: '2026-08-01', price: 19.99, buyBoxPrice: 19.99, isAmazon: false },
        ],
      };
    }

    // Default dynamic mock data for any other valid ASIN
    return {
      asin: normalizedAsin,
      title: `[MOCK] Generic Amazon Product (${normalizedAsin})`,
      brand: 'Mock Sample Brand',
      category: 'Home & Kitchen',
      currentPrice: 24.99,
      buyBoxPrice: 24.99,
      bsr: 8500,
      estimatedMonthlySales: 180,
      numberOfSellers: 4,
      fbaSellers: 3,
      fbmSellers: 1,
      amazonAsSeller: false,
      weight: { value: 0.75, unit: 'lbs' },
      dimensions: { length: 8.0, width: 5.0, height: 2.5, unit: 'inches' },
      sellingRestrictions: {
        isGated: false,
        approvalRequired: false,
        hazmat: false,
        meltable: false,
        reasons: [],
      },
      priceHistory: [
        { date: '2026-08-01', price: 27.99, buyBoxPrice: 27.99, isAmazon: false },
        { date: '2026-08-15', price: 24.99, buyBoxPrice: 24.99, isAmazon: false },
        { date: '2026-09-01', price: 24.99, buyBoxPrice: 24.99, isAmazon: false },
      ],
    };
  }
}
