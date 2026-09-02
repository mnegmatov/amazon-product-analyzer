import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ProductDataProvider, MockProductDataProvider } from './src/services/productDataProvider.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Data provider abstraction instance (currently using MockProductDataProvider)
const productDataProvider: ProductDataProvider = new MockProductDataProvider();

// Body parser with error handler for malformed JSON
app.use(express.json());
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError || err.status === 400 || 'body' in err) {
    return res.status(400).json({ error: 'Malformed or unreadable request body' });
  }
  next(err);
});

// Helper for exact Half-Up rounding matching Java BigDecimal
function roundHalfUp(num: number, decimals: number): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  const factor = Math.pow(10, decimals);
  const sign = num < 0 ? -1 : 1;
  return sign * (Math.round(Math.abs(num) * factor + 1e-12) / factor);
}

// Health check endpoint matching Spring Boot HealthController
app.get('/api/health', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('Amazon Product Analyzer is running!');
});

// Product details endpoint by ASIN (using ProductDataProvider abstraction)
app.get('/api/products/:asin', async (req: Request, res: Response) => {
  try {
    const rawAsin = req.params.asin;
    if (!rawAsin || typeof rawAsin !== 'string') {
      return res.status(400).json({ error: 'ASIN parameter is required' });
    }

    const asin = rawAsin.trim().toUpperCase();
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      return res.status(400).json({
        error: 'Invalid ASIN format. ASIN must be exactly 10 alphanumeric characters (e.g. B08XYZ1234)',
      });
    }

    const productData = await productDataProvider.getProductByAsin(asin);
    return res.status(200).json(productData);
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || 'Failed to retrieve product data',
    });
  }
});

// Product analysis endpoint matching Spring Boot ProductAnalysisController & ProductAnalysisService
app.post('/api/products/analyze', (req: Request, res: Response) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Malformed or unreadable request body' });
  }

  const fields: Record<string, string> = {};

  const validateField = (
    fieldName: string,
    val: any,
    minVal: number,
    minMsg: string
  ) => {
    if (val === undefined || val === null || val === '') {
      fields[fieldName] = 'must not be null';
    } else {
      const num = Number(val);
      if (isNaN(num)) {
        fields[fieldName] = 'must be a valid number';
      } else if (num < minVal) {
        fields[fieldName] = minMsg;
      }
    }
  };

  validateField('purchasePrice', body.purchasePrice, 0.01, 'must be greater than or equal to 0.01');
  validateField('sellingPrice', body.sellingPrice, 0.01, 'must be greater than or equal to 0.01');
  validateField('amazonFees', body.amazonFees, 0.00, 'must be greater than or equal to 0.00');
  validateField('fbaFee', body.fbaFee, 0.00, 'must be greater than or equal to 0.00');
  validateField('shipping', body.shipping, 0.00, 'must be greater than or equal to 0.00');

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      fields,
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

  const decision = profit > 0 && roi >= 30.00 ? 'BUY' : "DON'T BUY";

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
    profitMargin,
  });
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amazon Product Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
