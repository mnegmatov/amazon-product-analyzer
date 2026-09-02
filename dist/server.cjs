"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/services/mockProductDataProvider.ts
var MOCK_CATALOG = {
  B08XYZ1234: {
    title: "[MOCK] Ergonomic Wireless Mouse (Silent Click, 2.4G)",
    brand: "TechGrip (Mock Brand)",
    category: "Electronics > Computers & Accessories > Keyboards & Mice",
    currentPrice: 19.99,
    buyBoxPrice: 19.99,
    bsr: 1450,
    estimatedMonthlySales: 620,
    numberOfSellers: 6,
    fbaSellers: 4,
    fbmSellers: 2,
    amazonAsSeller: false,
    weight: { value: 0.32, unit: "lbs" },
    dimensions: { length: 4.6, width: 2.7, height: 1.5, unit: "inches" },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: []
    },
    priceHistory: [
      { date: "2026-08-01", price: 21.99, buyBoxPrice: 21.99, isAmazon: false },
      { date: "2026-08-15", price: 19.99, buyBoxPrice: 19.99, isAmazon: false },
      { date: "2026-09-01", price: 19.99, buyBoxPrice: 19.99, isAmazon: false }
    ]
  },
  B07ABC9876: {
    title: "[MOCK] Stainless Steel Insulated Water Bottle 750ml",
    brand: "HydroSteel (Mock Brand)",
    category: "Sports & Outdoors > Water Bottles",
    currentPrice: 19.99,
    buyBoxPrice: 19.99,
    bsr: 12500,
    estimatedMonthlySales: 95,
    numberOfSellers: 14,
    fbaSellers: 9,
    fbmSellers: 5,
    amazonAsSeller: false,
    weight: { value: 0.85, unit: "lbs" },
    dimensions: { length: 10.5, width: 3.2, height: 3.2, unit: "inches" },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: []
    },
    priceHistory: [
      { date: "2026-08-01", price: 24.99, buyBoxPrice: 24.99, isAmazon: false },
      { date: "2026-08-20", price: 19.99, buyBoxPrice: 19.99, isAmazon: false }
    ]
  },
  B09LMN4567: {
    title: "[MOCK] Premium Silicone Kitchen Utensils Set (10-Piece)",
    brand: "ChefCraft (Mock Brand)",
    category: "Home & Kitchen > Kitchen Utensils & Gadgets",
    currentPrice: 29.99,
    buyBoxPrice: 29.99,
    bsr: 5400,
    estimatedMonthlySales: 280,
    numberOfSellers: 4,
    fbaSellers: 3,
    fbmSellers: 1,
    amazonAsSeller: false,
    weight: { value: 1.45, unit: "lbs" },
    dimensions: { length: 13, width: 4.5, height: 4.5, unit: "inches" },
    sellingRestrictions: {
      isGated: false,
      approvalRequired: false,
      hazmat: false,
      meltable: false,
      reasons: []
    },
    priceHistory: [
      { date: "2026-08-01", price: 32.99, buyBoxPrice: 32.99, isAmazon: false },
      { date: "2026-08-25", price: 29.99, buyBoxPrice: 29.99, isAmazon: false }
    ]
  }
};
var MockProductDataProvider = class {
  /**
   * Returns mock product details for a given ASIN.
   * @param asin - Amazon ASIN (e.g. "B08XYZ1234")
   */
  async getProductByAsin(asin) {
    const normalizedAsin = (asin || "").trim().toUpperCase();
    const knownMock = MOCK_CATALOG[normalizedAsin];
    if (knownMock) {
      return {
        asin: normalizedAsin,
        title: knownMock.title ?? `[MOCK] Product ${normalizedAsin}`,
        brand: knownMock.brand ?? "Generic Mock Brand",
        category: knownMock.category ?? "General Merchandise",
        currentPrice: knownMock.currentPrice ?? 19.99,
        buyBoxPrice: knownMock.buyBoxPrice ?? 19.99,
        bsr: knownMock.bsr ?? 5e3,
        estimatedMonthlySales: knownMock.estimatedMonthlySales ?? 300,
        numberOfSellers: knownMock.numberOfSellers ?? 5,
        fbaSellers: knownMock.fbaSellers ?? 3,
        fbmSellers: knownMock.fbmSellers ?? 2,
        amazonAsSeller: knownMock.amazonAsSeller ?? false,
        weight: knownMock.weight ?? { value: 0.5, unit: "lbs" },
        dimensions: knownMock.dimensions ?? { length: 6, width: 4, height: 2, unit: "inches" },
        sellingRestrictions: knownMock.sellingRestrictions ?? {
          isGated: false,
          approvalRequired: false,
          hazmat: false,
          meltable: false,
          reasons: []
        },
        priceHistory: knownMock.priceHistory ?? [
          { date: "2026-08-01", price: 19.99, buyBoxPrice: 19.99, isAmazon: false }
        ]
      };
    }
    return {
      asin: normalizedAsin,
      title: `[MOCK] Generic Amazon Product (${normalizedAsin})`,
      brand: "Mock Sample Brand",
      category: "Home & Kitchen",
      currentPrice: 24.99,
      buyBoxPrice: 24.99,
      bsr: 8500,
      estimatedMonthlySales: 180,
      numberOfSellers: 4,
      fbaSellers: 3,
      fbmSellers: 1,
      amazonAsSeller: false,
      weight: { value: 0.75, unit: "lbs" },
      dimensions: { length: 8, width: 5, height: 2.5, unit: "inches" },
      sellingRestrictions: {
        isGated: false,
        approvalRequired: false,
        hazmat: false,
        meltable: false,
        reasons: []
      },
      priceHistory: [
        { date: "2026-08-01", price: 27.99, buyBoxPrice: 27.99, isAmazon: false },
        { date: "2026-08-15", price: 24.99, buyBoxPrice: 24.99, isAmazon: false },
        { date: "2026-09-01", price: 24.99, buyBoxPrice: 24.99, isAmazon: false }
      ]
    };
  }
};

// server.ts
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT) || 3e3;
var productDataProvider = new MockProductDataProvider();
app.use(import_express.default.json());
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError || err.status === 400 || "body" in err) {
    return res.status(400).json({ error: "Malformed or unreadable request body" });
  }
  next(err);
});
function roundHalfUp(num, decimals) {
  if (isNaN(num) || !isFinite(num)) return 0;
  const factor = Math.pow(10, decimals);
  const sign = num < 0 ? -1 : 1;
  return sign * (Math.round(Math.abs(num) * factor + 1e-12) / factor);
}
app.get("/api/health", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send("Amazon Product Analyzer is running!");
});
app.get("/api/products/:asin", async (req, res) => {
  try {
    const rawAsin = req.params.asin;
    if (!rawAsin || typeof rawAsin !== "string") {
      return res.status(400).json({ error: "ASIN parameter is required" });
    }
    const asin = rawAsin.trim().toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return res.status(400).json({
        error: "Invalid ASIN format. ASIN must be exactly 10 alphanumeric characters (e.g. B08XYZ1234)"
      });
    }
    const productData = await productDataProvider.getProductByAsin(asin);
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || "Failed to retrieve product data"
    });
  }
});
app.post("/api/products/analyze", (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Malformed or unreadable request body" });
  }
  const fields = {};
  const validateField = (fieldName, val, minVal, minMsg) => {
    if (val === void 0 || val === null || val === "") {
      fields[fieldName] = "must not be null";
    } else {
      const num = Number(val);
      if (isNaN(num)) {
        fields[fieldName] = "must be a valid number";
      } else if (num < minVal) {
        fields[fieldName] = minMsg;
      }
    }
  };
  validateField("purchasePrice", body.purchasePrice, 0.01, "must be greater than or equal to 0.01");
  validateField("sellingPrice", body.sellingPrice, 0.01, "must be greater than or equal to 0.01");
  validateField("amazonFees", body.amazonFees, 0, "must be greater than or equal to 0.00");
  validateField("fbaFee", body.fbaFee, 0, "must be greater than or equal to 0.00");
  validateField("shipping", body.shipping, 0, "must be greater than or equal to 0.00");
  if (Object.keys(fields).length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      fields
    });
  }
  const purchasePrice = Number(body.purchasePrice);
  const sellingPrice = Number(body.sellingPrice);
  const amazonFees = Number(body.amazonFees);
  const fbaFee = Number(body.fbaFee);
  const shipping = Number(body.shipping);
  const totalCosts = roundHalfUp(purchasePrice + amazonFees + fbaFee + shipping, 2);
  const profit = roundHalfUp(sellingPrice - totalCosts, 2);
  const investment = roundHalfUp(purchasePrice + shipping, 2);
  let roi = 0;
  if (investment !== 0) {
    const roiRatio = roundHalfUp(profit / investment, 4);
    roi = roundHalfUp(roiRatio * 100, 2);
  }
  const decision = profit > 0 && roi >= 30 ? "BUY" : "DON'T BUY";
  let profitMargin = 0;
  if (sellingPrice !== 0) {
    const marginRatio = roundHalfUp(profit / sellingPrice, 4);
    profitMargin = roundHalfUp(marginRatio * 100, 2);
  }
  return res.status(200).json({
    profit,
    roi,
    decision,
    totalCosts,
    investment,
    profitMargin
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Amazon Product Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
