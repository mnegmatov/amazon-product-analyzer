import test from 'node:test';
import assert from 'node:assert/strict';
import { AmazonProductDataProvider } from '../amazonProductDataProvider.ts';

test('AmazonProductDataProvider implements ProductDataProvider interface (has getProductByAsin)', () => {
  const provider = new AmazonProductDataProvider();
  assert.equal(typeof provider.getProductByAsin, 'function',
    'getProductByAsin must be a function (interface contract)');
});

test('AmazonProductDataProvider.isConfigured() returns false with no config', () => {
  const provider = new AmazonProductDataProvider();
  assert.equal(provider.isConfigured(), false,
    'Provider must report not configured when credentials are missing');
});

test('AmazonProductDataProvider.isConfigured() returns false when only some credentials are provided', () => {
  const provider = new AmazonProductDataProvider({
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    // missing lwaClientId, lwaClientSecret, lwaRefreshToken, marketplaceId
  });
  assert.equal(provider.isConfigured(), false,
    'Provider must not report configured with incomplete credentials');
});

test('AmazonProductDataProvider.isConfigured() returns true when all required credentials provided', () => {
  const provider = new AmazonProductDataProvider({
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    lwaClientId: 'amzn1.application-oa2-client.example',
    lwaClientSecret: 'lwa-client-secret-example',
    lwaRefreshToken: 'Atzr|example-refresh-token',
    marketplaceId: 'ATVPDKIKX0DER',
  });
  assert.equal(provider.isConfigured(), true,
    'Provider must report configured when all required credentials are present');
});

test('AmazonProductDataProvider.getProductByAsin() throws clear error when not configured', async () => {
  const provider = new AmazonProductDataProvider();
  await assert.rejects(
    () => provider.getProductByAsin('B08XYZ1234'),
    (err: unknown) => {
      assert.ok(err instanceof Error, 'Must throw an Error instance');
      assert.ok(
        err.message.includes('Amazon SP-API integration is not configured yet'),
        `Error message must clearly indicate the provider is not configured. Got: "${err.message}"`
      );
      return true;
    }
  );
});

test('AmazonProductDataProvider.getProductByAsin() throws even with partial config', async () => {
  const provider = new AmazonProductDataProvider({
    accessKeyId: 'some-key',
  });
  await assert.rejects(
    () => provider.getProductByAsin('B09LMN4567'),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Amazon SP-API integration is not configured yet'));
      return true;
    }
  );
});

test('AmazonProductDataProvider accepts empty config object without throwing', () => {
  assert.doesNotThrow(() => new AmazonProductDataProvider({}),
    'Constructor must not throw with an empty config');
});

test('AmazonProductDataProvider accepts no config argument without throwing', () => {
  assert.doesNotThrow(() => new AmazonProductDataProvider(),
    'Constructor must not throw when called with no arguments');
});
