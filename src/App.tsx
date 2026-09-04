import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AnalyzerForm } from './components/AnalyzerForm.tsx';
import { ResultDisplay } from './components/ResultDisplay.tsx';
import { HistoryList, HistoryItem } from './components/HistoryList.tsx';
import { ProductInput, ProductAnalysisResult, ProductData } from './types.ts';
import { ProductDataCard } from './components/ProductDataCard.tsx';

const STORAGE_KEY = 'amazon_product_analysis_history_v2';

export const App: React.FC = () => {
  const [input, setInput] = useState<ProductInput>({
    title: 'Беспроводная мышь (Ergonomic)',
    asin: 'B08XYZ1234',
    purchasePrice: 6.67,
    sellingPrice: 19.99,
    amazonFees: 3.00,
    fbaFee: 4.10,
    shipping: 1.50,
  });

  const [result, setResult] = useState<ProductAnalysisResult | null>(null);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [isPriceFromProductData, setIsPriceFromProductData] = useState(false);
  const lastLoadedAsinRef = React.useRef<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore local storage quota limits
    }
  }, [history]);

  const handleManualPriceEdit = () => {
    setIsPriceFromProductData(false);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedAsin = (typeof input.asin === 'string' ? input.asin : '').trim().toUpperCase();
    const newErrors: Record<string, string> = {};

    if (!trimmedAsin) {
      newErrors.asin = 'ASIN обязателен для заполнения';
    } else if (!/^[A-Z0-9]{10}$/.test(trimmedAsin)) {
      newErrors.asin = 'ASIN должен содержать ровно 10 символов (буквы и цифры, например: B08XYZ1234)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (input.asin !== trimmedAsin) {
      setInput((prev) => ({ ...prev, asin: trimmedAsin }));
    }

    const isNewProduct = trimmedAsin !== lastLoadedAsinRef.current;
    let effectiveSellingPrice = Number(input.sellingPrice);

    // 1. Fetch Amazon Product Data (MockProductDataProvider)
    setProductLoading(true);
    setProductError(null);
    try {
      const prodRes = await fetch(`/api/products/${encodeURIComponent(trimmedAsin)}`, {
        headers: { 'Accept': 'application/json' },
      });
      const prodData = await prodRes.json().catch(() => null);
      if (!prodRes.ok) {
        setProductError(prodData?.error || `Ошибка сервера при получении данных о товаре (${prodRes.status})`);
      } else if (prodData) {
        setProductData(prodData);
        // Only populate the Selling Price from buyBoxPrice when a new product is successfully loaded
        if (isNewProduct && prodData.buyBoxPrice != null && Number(prodData.buyBoxPrice) > 0) {
          effectiveSellingPrice = Number(prodData.buyBoxPrice);
          setInput((prev) => ({
            ...prev,
            sellingPrice: prodData.buyBoxPrice,
          }));
          setIsPriceFromProductData(true);
        }
        lastLoadedAsinRef.current = prodData.asin || trimmedAsin;
      }
    } catch (err: any) {
      setProductError(`Не удалось соединиться с сервисом данных товара (${err?.message || 'Ошибка сети'}).`);
    } finally {
      setProductLoading(false);
    }

    // 2. Financial calculation (/api/products/analyze)
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        purchasePrice: Number(input.purchasePrice),
        sellingPrice: effectiveSellingPrice,
        amazonFees: Number(input.amazonFees),
        fbaFee: Number(input.fbaFee),
        shipping: Number(input.shipping),
      };

      const res = await fetch('/api/products/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data && data.fields) {
          setErrors(data.fields);
        } else if (data && data.error) {
          setErrors({ _global: data.error });
        } else {
          setErrors({
            _global: `Ошибка сервера (код ${res.status}). Проверьте введённые данные.`,
          });
        }
      } else if (data) {
        setResult(data);

        // Сохраняем в историю
        const historyEntry: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          title: (typeof input.title === 'string' && input.title.trim()) || 'Товар без названия',
          asin: (typeof input.asin === 'string' && input.asin.trim()) || undefined,
          input: {
            purchasePrice: Number(input.purchasePrice),
            sellingPrice: effectiveSellingPrice,
            amazonFees: Number(input.amazonFees),
            fbaFee: Number(input.fbaFee),
            shipping: Number(input.shipping),
          },
          result: {
            profit: data.profit,
            roi: data.roi,
            decision: data.decision,
          },
          createdAt: new Date().toISOString(),
        };

        setHistory((prev) => [historyEntry, ...prev.filter(item => item.asin !== historyEntry.asin).slice(0, 24)]);
      }
    } catch (err: any) {
      setErrors({
        _global: `Не удалось соединиться с сервисом расчёта (${err.message || 'Ошибка сети'}).`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Perform initial calculation on load
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleApplyPreset = (preset: ProductInput) => {
    setInput(preset);
    setErrors({});
    setProductError(null);
    setIsPriceFromProductData(false);
    lastLoadedAsinRef.current = null;
  };

  const handleReset = () => {
    setInput({
      title: '',
      asin: '',
      purchasePrice: '',
      sellingPrice: '',
      amazonFees: '',
      fbaFee: '',
      shipping: '',
    });
    setResult(null);
    setProductData(null);
    setProductError(null);
    setIsPriceFromProductData(false);
    setErrors({});
    lastLoadedAsinRef.current = null;
  };

  const handleRestoreBuyBox = () => {
    setIsPriceFromProductData(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column: Form & History */}
          <div className="lg:col-span-6 space-y-4">
            <AnalyzerForm
              input={input}
              setInput={setInput}
              onAnalyze={handleAnalyze}
              loading={loading}
              errors={errors}
              onApplyPreset={handleApplyPreset}
              isPriceFromProductData={isPriceFromProductData}
              onManualPriceEdit={handleManualPriceEdit}
              onReset={handleReset}
              buyBoxPrice={productData?.buyBoxPrice ?? null}
              onRestoreBuyBox={handleRestoreBuyBox}
            />

            <HistoryList
              items={history}
              onSelect={(selected) => {
                setInput(selected);
                setErrors({});
                setProductError(null);
                setIsPriceFromProductData(false);
                lastLoadedAsinRef.current = selected.asin || null;
              }}
              onClear={handleClearHistory}
            />
          </div>

          {/* Right Column: Visual Result & Hierarchy */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-20">
            <ResultDisplay result={result} input={input} />
            <ProductDataCard
              product={productData}
              loading={productLoading}
              error={productError}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Amazon Product Analyzer — Расчёт маржинальности и окупаемости FBA</span>
          <span className="text-slate-400">Правило: ROI ≥ 30% и Прибыль &gt; $0</span>
        </div>
      </footer>
    </div>
  );
};

export default App;


