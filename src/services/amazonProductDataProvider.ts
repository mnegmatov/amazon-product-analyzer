import { ProductData, ProductDataProvider } from '../types.ts';

/**
 * ============================================================================
 * AMAZON SP-API CONFIGURATION
 * ============================================================================
 * Placeholder for future Amazon Selling Partner API credentials and settings.
 * These fields are intentionally optional — no credentials are required now.
 * When real integration is implemented, populate this from environment variables
 * or a secrets manager (never commit real credentials to source control).
 * ============================================================================
 */
export interface AmazonSpApiConfig {
  /**
   * AWS IAM Access Key ID for SP-API authentication.
   * Future: process.env.AMAZON_ACCESS_KEY_ID
   */
  accessKeyId?: string;

  /**
   * AWS IAM Secret Access Key for SP-API authentication.
   * Future: process.env.AMAZON_SECRET_ACCESS_KEY
   */
  secretAccessKey?: string;

  /**
   * AWS IAM Role ARN used by SP-API for role-based access.
   * Future: process.env.AMAZON_ROLE_ARN
   */
  roleArn?: string;

  /**
   * LWA (Login With Amazon) Client ID — identifies the SP-API application.
   * Future: process.env.AMAZON_LWA_CLIENT_ID
   */
  lwaClientId?: string;

  /**
   * LWA (Login With Amazon) Client Secret.
   * Future: process.env.AMAZON_LWA_CLIENT_SECRET
   */
  lwaClientSecret?: string;

  /**
   * LWA Refresh Token for the seller account.
   * Future: process.env.AMAZON_REFRESH_TOKEN
   */
  lwaRefreshToken?: string;

  /**
   * Amazon marketplace ID (e.g. ATVPDKIKX0DER for US, A1F83G8C2ARO7P for UK).
   * Future: process.env.AMAZON_MARKETPLACE_ID
   */
  marketplaceId?: string;

  /**
   * SP-API endpoint region (e.g. 'us-east-1', 'eu-west-1').
   * Future: process.env.AMAZON_SP_API_REGION
   */
  region?: string;
}

/**
 * ============================================================================
 * AMAZON SP-API PRODUCT DATA PROVIDER
 * ============================================================================
 *
 * Placeholder implementation of ProductDataProvider for Amazon SP-API.
 *
 * CURRENT STATUS: NOT CONFIGURED — throws a clear error on any call.
 *
 * When implementing the real integration, this class will call:
 *   - Catalog Items API v2022-04-01   → title, brand, category, dimensions, weight
 *   - Product Pricing API v0           → currentPrice, buyBoxPrice, numberOfSellers
 *   - Product Fees API v0              → estimated fees
 *   - (3rd-party / Keepa)             → bsr, estimatedMonthlySales, priceHistory
 *
 * SWITCHING FROM MOCK → AMAZON:
 * In server.ts, change only the one import/instantiation line:
 *   const productDataProvider: ProductDataProvider = new AmazonProductDataProvider(config);
 * No other code needs to change.
 * ============================================================================
 */
export class AmazonProductDataProvider implements ProductDataProvider {
  private readonly config: AmazonSpApiConfig;

  constructor(config: AmazonSpApiConfig = {}) {
    this.config = config;
  }

  /**
   * Returns true when the minimum required SP-API credentials are present.
   * Used internally to gate real API calls.
   */
  isConfigured(): boolean {
    return Boolean(
      this.config.accessKeyId &&
      this.config.secretAccessKey &&
      this.config.lwaClientId &&
      this.config.lwaClientSecret &&
      this.config.lwaRefreshToken &&
      this.config.marketplaceId
    );
  }

  /**
   * Retrieves Amazon product data by ASIN via SP-API.
   *
   * NOT IMPLEMENTED YET — throws a clear error until credentials are
   * configured and real API calls are added.
   *
   * @param asin - 10-character Amazon ASIN
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProductByAsin(asin: string): Promise<ProductData> {
    if (!this.isConfigured()) {
      throw new Error(
        'Amazon SP-API integration is not configured yet. ' +
        'Please provide valid AmazonSpApiConfig credentials (accessKeyId, secretAccessKey, ' +
        'lwaClientId, lwaClientSecret, lwaRefreshToken, marketplaceId). ' +
        'The application is currently using MockProductDataProvider.'
      );
    }

    /**
     * TODO (future implementation steps):
     *
     * Step 1 — LWA token exchange:
     *   POST https://api.amazon.com/auth/o2/token
     *   { grant_type, client_id, client_secret, refresh_token }
     *   → access_token (valid 1 hour)
     *
     * Step 2 — AWS SigV4 request signing using accessKeyId + secretAccessKey + roleArn.
     *
     * Step 3 — Catalog Items API (title, brand, category, dimensions, weight):
     *   GET https://sellingpartnerapi-na.amazon.com/catalog/2022-04-01/items/:asin
     *   ?marketplaceIds=<marketplaceId>&includedData=attributes,dimensions,images
     *
     * Step 4 — Product Pricing API (buyBoxPrice, numberOfSellers):
     *   GET https://sellingpartnerapi-na.amazon.com/products/pricing/v0/items/:asin/offers
     *   ?marketplaceId=<marketplaceId>&ItemCondition=New
     *
     * Step 5 — Map raw SP-API responses to the internal ProductData model.
     *
     * The ProductData model is intentionally kept stable so that all mapping
     * happens here, and the rest of the application remains unchanged.
     */

    // Guard: real calls not implemented yet — should never reach this point
    // once isConfigured() returns true without implementation below.
    throw new Error(
      'Amazon SP-API integration is not configured yet.'
    );
  }
}
