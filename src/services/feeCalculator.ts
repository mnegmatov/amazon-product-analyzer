import { ProductData, FeeCalculationInput, FeeBreakdown, FeeCalculator } from '../types.ts';

export type { FeeCalculationInput, FeeBreakdown, FeeCalculator };

/**
 * Helper for exact half-up 2-decimal rounding.
 */
function roundToTwo(num: number): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * ============================================================================
 * MOCK FEE CALCULATOR (FOR DEVELOPMENT / TESTING ONLY)
 * ============================================================================
 * NOTE: This is a synthetic mock fee estimation service.
 * It does NOT fetch live rates from Amazon Selling Partner API.
 * Rates are modeled after standard approximate US FBA fee structures:
 * - Referral Fee: ~15% of selling price (minimum $0.30)
 * - FBA Fulfillment Fee: Estimated by weight tier:
 *     - <= 1 lb:  $3.50
 *     - <= 2 lbs: $4.75
 *     - <= 3 lbs: $5.50
 *     - > 3 lbs:  $6.50 + $0.50 per additional lb
 *     - Default (unknown weight): $4.00
 * ============================================================================
 */
export class MockFeeCalculator implements FeeCalculator {
  /**
   * Calculates simulated Amazon fees for a given product and selling price.
   */
  calculateFees(input: FeeCalculationInput): FeeBreakdown {
    const sellingPrice = Math.max(0, Number(input.sellingPrice) || 0);

    // 1. Mock Referral Fee: 15% with a standard $0.30 minimum if price > 0
    let referralFee = 0;
    if (sellingPrice > 0) {
      const computedReferral = sellingPrice * 0.15;
      referralFee = roundToTwo(Math.max(0.30, computedReferral));
    }

    // 2. Mock FBA Fee: estimated from product weight
    const weightInLbs = this.extractWeightInLbs(input.product);
    const fbaFee = this.estimateMockFbaFee(weightInLbs);

    // 3. Optional variable closing fee (mock 0 for standard goods)
    const variableClosingFee = 0;

    // 4. Total Amazon Fees
    const totalAmazonFees = roundToTwo(referralFee + fbaFee + variableClosingFee);

    // 5. Effective fee percentage
    const feePercentage = sellingPrice > 0
      ? roundToTwo((totalAmazonFees / sellingPrice) * 100)
      : 0;

    return {
      referralFee,
      fbaFee,
      variableClosingFee,
      totalAmazonFees,
      feePercentage,
      isMockEstimate: true,
      currency: 'USD',
      disclaimer: 'MOCK ESTIMATE: Fees are estimated based on mock weight and referral tiers for development/testing. Real Amazon fees vary by exact category, size tier, and active SP-API rate cards.',
    };
  }

  /**
   * Helper to parse weight into pounds (lbs).
   */
  private extractWeightInLbs(product?: ProductData): number | null {
    if (!product || product.weight == null) {
      return null;
    }

    if (typeof product.weight === 'number') {
      return product.weight > 0 ? product.weight : null;
    }

    if (typeof product.weight === 'object' && product.weight.value != null) {
      const val = Number(product.weight.value);
      if (isNaN(val) || val <= 0) return null;

      const unit = (product.weight.unit || 'lbs').toLowerCase();
      if (unit === 'oz' || unit === 'ounces') {
        return val / 16;
      }
      if (unit === 'kg' || unit === 'kilograms') {
        return val * 2.20462;
      }
      if (unit === 'g' || unit === 'grams') {
        return (val / 1000) * 2.20462;
      }
      return val;
    }

    return null;
  }

  /**
   * Estimates mock FBA fulfillment fee based on weight tier.
   */
  private estimateMockFbaFee(weightInLbs: number | null): number {
    if (weightInLbs == null) {
      return 4.00; // Default mock standard fee when weight is unspecified
    }

    if (weightInLbs <= 1.0) {
      return 3.50;
    }
    if (weightInLbs <= 2.0) {
      return 4.75;
    }
    if (weightInLbs <= 3.0) {
      return 5.50;
    }

    // Heavier items: $6.50 + $0.50 per additional lb over 3 lbs
    const excess = Math.ceil(weightInLbs - 3.0);
    return roundToTwo(6.50 + excess * 0.50);
  }
}

/** Default singleton instance of MockFeeCalculator */
export const mockFeeCalculator = new MockFeeCalculator();
