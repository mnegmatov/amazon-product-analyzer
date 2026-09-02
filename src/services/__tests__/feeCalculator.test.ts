import test from 'node:test';
import assert from 'node:assert/strict';
import { MockFeeCalculator, mockFeeCalculator } from '../feeCalculator.ts';
import { ProductData } from '../../types.ts';

test('FeeCalculator: normal product calculates predictable referral and FBA fees', () => {
  const calculator = new MockFeeCalculator();

  const product: ProductData = {
    asin: 'B08XYZ1234',
    title: 'Wireless Ergonomic Mouse',
    brand: 'TechBrand',
    category: 'Electronics',
    currentPrice: 19.99,
    buyBoxPrice: 19.99,
    weight: { value: 0.32, unit: 'lbs' },
  };

  const result = calculator.calculateFees({
    product,
    sellingPrice: 19.99,
  });

  // 15% of 19.99 = 2.9985 -> round to 3.00
  assert.equal(result.referralFee, 3.00);
  // <= 1.0 lb -> 3.50
  assert.equal(result.fbaFee, 3.50);
  // Total = 3.00 + 3.50 = 6.50
  assert.equal(result.totalAmazonFees, 6.50);
  assert.equal(result.isMockEstimate, true);
  assert.equal(result.currency, 'USD');
  assert.ok(result.disclaimer.includes('MOCK ESTIMATE'));
});

test('FeeCalculator: different selling prices calculate referral fees accurately', () => {
  const calculator = new MockFeeCalculator();
  const product: ProductData = {
    asin: 'B000TEST01',
    weight: 0.8,
  };

  // 1. Minimum referral fee applies for very low price (15% of $1.00 is $0.15, min is $0.30)
  const lowPriceResult = calculator.calculateFees({
    product,
    sellingPrice: 1.00,
  });
  assert.equal(lowPriceResult.referralFee, 0.30);

  // 2. Normal price: $20.00 -> 15% = $3.00
  const normalPriceResult = calculator.calculateFees({
    product,
    sellingPrice: 20.00,
  });
  assert.equal(normalPriceResult.referralFee, 3.00);

  // 3. Higher price: $100.00 -> 15% = $15.00
  const highPriceResult = calculator.calculateFees({
    product,
    sellingPrice: 100.00,
  });
  assert.equal(highPriceResult.referralFee, 15.00);

  // 4. Zero price edge case: $0.00 -> 0 referral fee
  const zeroPriceResult = calculator.calculateFees({
    product,
    sellingPrice: 0,
  });
  assert.equal(zeroPriceResult.referralFee, 0);
  assert.equal(zeroPriceResult.feePercentage, 0);
});

test('FeeCalculator: predictable mock FBA fees across different weight tiers', () => {
  const calculator = new MockFeeCalculator();

  // Tier 1: <= 1 lb -> $3.50
  const lightItem: ProductData = {
    asin: 'B001LIGHT1',
    weight: { value: 0.5, unit: 'lbs' },
  };
  assert.equal(calculator.calculateFees({ product: lightItem, sellingPrice: 20 }).fbaFee, 3.50);

  // Tier 1 in ounces: 12 oz = 0.75 lb <= 1 lb -> $3.50
  const ozItem: ProductData = {
    asin: 'B001OZITEM',
    weight: { value: 12, unit: 'oz' },
  };
  assert.equal(calculator.calculateFees({ product: ozItem, sellingPrice: 20 }).fbaFee, 3.50);

  // Tier 2: 1 to 2 lbs -> $4.75
  const mediumItem: ProductData = {
    asin: 'B002MED002',
    weight: 1.5,
  };
  assert.equal(calculator.calculateFees({ product: mediumItem, sellingPrice: 20 }).fbaFee, 4.75);

  // Tier 3: 2 to 3 lbs -> $5.50
  const standardItem: ProductData = {
    asin: 'B003STD003',
    weight: { value: 2.8, unit: 'lbs' },
  };
  assert.equal(calculator.calculateFees({ product: standardItem, sellingPrice: 20 }).fbaFee, 5.50);

  // Tier 4: > 3 lbs (e.g. 5.0 lbs -> 6.50 + 2 * 0.50 = $7.50)
  const heavyItem: ProductData = {
    asin: 'B004HVY004',
    weight: { value: 5.0, unit: 'lbs' },
  };
  assert.equal(calculator.calculateFees({ product: heavyItem, sellingPrice: 20 }).fbaFee, 7.50);

  // Default when weight is not specified -> $4.00
  const unkWeightItem: ProductData = {
    asin: 'B005UNK005',
  };
  assert.equal(calculator.calculateFees({ product: unkWeightItem, sellingPrice: 20 }).fbaFee, 4.00);
});

test('FeeCalculator: total fees calculation matches sum of individual fees and calculates percentage', () => {
  const product: ProductData = {
    asin: 'B09LMN4567',
    weight: 1.45,
  };

  const result = mockFeeCalculator.calculateFees({
    product,
    sellingPrice: 30.00,
  });

  // 15% of 30.00 = 4.50
  assert.equal(result.referralFee, 4.50);
  // 1.45 lbs -> $4.75
  assert.equal(result.fbaFee, 4.75);
  assert.equal(result.variableClosingFee, 0);

  // Total must be exact sum: 4.50 + 4.75 = 9.25
  assert.equal(result.totalAmazonFees, 9.25);

  // Percentage = (9.25 / 30.00) * 100 = 30.83%
  assert.equal(result.feePercentage, 30.83);
});
