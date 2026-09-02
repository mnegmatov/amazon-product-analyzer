import test from 'node:test';
import assert from 'node:assert/strict';
import { MockProductDataProvider } from '../mockProductDataProvider.ts';

test('MockProductDataProvider returns valid product data for known ASIN', async () => {
  const provider = new MockProductDataProvider();
  const data = await provider.getProductByAsin('B08XYZ1234');

  assert.equal(data.asin, 'B08XYZ1234');
  assert.equal(data.currentPrice, 19.99);
  assert.equal(data.buyBoxPrice, 19.99);
  assert.equal(data.amazonAsSeller, false);
  assert.ok(data.title && data.title.includes('Ergonomic Wireless Mouse'));
  assert.ok(data.priceHistory && data.priceHistory.length > 0);
});

test('MockProductDataProvider normalizes ASIN with whitespace and lowercase', async () => {
  const provider = new MockProductDataProvider();
  const data = await provider.getProductByAsin('  b012345678  ');

  assert.equal(data.asin, 'B012345678');
  assert.ok(data.currentPrice && data.currentPrice > 0);
  assert.ok(data.bsr && data.bsr > 0);
  assert.ok(data.estimatedMonthlySales && data.estimatedMonthlySales > 0);
});

test('MockProductDataProvider provides valid buyBoxPrice for defaulting selling price', async () => {
  const provider = new MockProductDataProvider();
  const item1 = await provider.getProductByAsin('B08XYZ1234');
  assert.equal(item1.buyBoxPrice, 19.99);

  const item2 = await provider.getProductByAsin('B09LMN4567');
  assert.equal(item2.buyBoxPrice, 29.99);

  const itemGeneric = await provider.getProductByAsin('B000000001');
  assert.ok(typeof itemGeneric.buyBoxPrice === 'number' && itemGeneric.buyBoxPrice > 0);
});
