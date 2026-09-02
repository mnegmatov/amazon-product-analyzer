import React, { useState } from 'react';
import { DollarSign, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ProductInput } from '../types.ts';

interface AnalyzerFormProps {
  input: ProductInput;
  setInput: React.Dispatch<React.SetStateAction<ProductInput>>;
  onAnalyze: (e: React.FormEvent) => void;
  loading: boolean;
  errors: Record<string, string>;
  onApplyPreset: (preset: ProductInput) => void;
}

const PRESETS: { label: string; data: ProductInput }[] = [
  {
    label: 'Выгодный товар',
    data: {
      title: 'Беспроводная мышь (Ergonomic)',
      asin: 'B08XYZ1234',
      purchasePrice: 6.67,
      sellingPrice: 19.99,
      amazonFees: 3.00,
      fbaFee: 4.10,
      shipping: 1.50,
    },
  },
  {
    label: 'Убыточный товар',
    data: {
      title: 'Термобутылка 750ml',
      asin: 'B07ABC9876',
      purchasePrice: 15.00,
      sellingPrice: 19.99,
      amazonFees: 5.00,
      fbaFee: 5.00,
      shipping: 2.00,
    },
  },
  {
    label: 'Низкий ROI',
    data: {
      title: 'Набор кухонных принадлежностей',
      asin: 'B09LMN4567',
      purchasePrice: 18.00,
      sellingPrice: 29.99,
      amazonFees: 4.50,
      fbaFee: 5.50,
      shipping: 1.50,
    },
  },
];

export const AnalyzerForm: React.FC<AnalyzerFormProps> = ({
  input,
  setInput,
  onAnalyze,
  loading,
  errors,
  onApplyPreset,
}) => {
  const [showOptional, setShowOptional] = useState(false);

  const handleChange = (field: keyof ProductInput, value: string) => {
    setInput((prev) => ({
      ...prev,
      [field]: value === '' ? '' : value,
    }));
  };

  const getFieldError = (fieldName: string): string | null => {
    const rawError = errors[fieldName];
    if (!rawError) return null;
    if (rawError.includes('0.01')) return 'Минимум $0.01';
    if (rawError.includes('0.00')) return 'Не может быть отрицательным';
    if (rawError.includes('null') || rawError.includes('empty')) return 'Обязательное поле';
    if (rawError.includes('valid number')) return 'Введите корректное число';
    return rawError;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-800/80">
      {/* Header with Title & Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-slate-100">Параметры товара</h2>
          <p className="text-xs text-slate-400 mt-0.5">Введите цены и комиссии для быстрой проверки</p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Примеры:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApplyPreset(p.data)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition cursor-pointer font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onAnalyze} className="mt-4 space-y-4">
        {/* Main Price Inputs: Purchase Price & Selling Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Цена закупки */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Цена закупки ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="6.67"
                value={input.purchasePrice}
                onChange={(e) => handleChange('purchasePrice', e.target.value)}
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                  getFieldError('purchasePrice')
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Сколько вы платите поставщику</p>
            {getFieldError('purchasePrice') && (
              <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError('purchasePrice')}
              </p>
            )}
          </div>

          {/* Цена продажи */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Цена продажи на Amazon ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="19.99"
                value={input.sellingPrice}
                onChange={(e) => handleChange('sellingPrice', e.target.value)}
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                  getFieldError('sellingPrice')
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Текущая цена в Buy Box на Amazon</p>
            {getFieldError('sellingPrice') && (
              <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError('sellingPrice')}
              </p>
            )}
          </div>
        </div>

        {/* Fees Inputs: Amazon, FBA, Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Комиссия Amazon */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Комиссия Amazon ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.00"
                placeholder="3.00"
                value={input.amazonFees}
                onChange={(e) => handleChange('amazonFees', e.target.value)}
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                  getFieldError('amazonFees')
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-amber-500'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Реферальная комиссия (~15%)</p>
            {getFieldError('amazonFees') && (
              <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError('amazonFees')}
              </p>
            )}
          </div>

          {/* FBA сбор */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              FBA сбор ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.00"
                placeholder="4.10"
                value={input.fbaFee}
                onChange={(e) => handleChange('fbaFee', e.target.value)}
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                  getFieldError('fbaFee')
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-amber-500'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Склад и доставка покупателю</p>
            {getFieldError('fbaFee') && (
              <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError('fbaFee')}
              </p>
            )}
          </div>

          {/* Доставка */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Доставка ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.00"
                placeholder="1.50"
                value={input.shipping}
                onChange={(e) => handleChange('shipping', e.target.value)}
                className={`w-full pl-7 pr-3 py-2 text-sm bg-slate-950 border rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
                  getFieldError('shipping')
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-amber-500'
                }`}
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Доставка до склада FBA</p>
            {getFieldError('shipping') && (
              <p className="text-[11px] text-rose-400 mt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError('shipping')}
              </p>
            )}
          </div>
        </div>

        {/* Optional Title & ASIN Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 transition cursor-pointer"
          >
            {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showOptional ? 'Скрыть название и ASIN' : 'Указать название или ASIN (опционально)'}</span>
          </button>

          {showOptional && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2.5 border-t border-slate-800/60">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Название товара
                </label>
                <input
                  type="text"
                  placeholder="Беспроводная мышь"
                  value={input.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  ASIN / Артикул
                </label>
                <input
                  type="text"
                  placeholder="B08XYZ1234"
                  value={input.asin || ''}
                  onChange={(e) => handleChange('asin', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>
            </div>
          )}
        </div>

        {/* Global error banner if any */}
        {errors._global && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errors._global}</span>
          </div>
        )}

        {/* Main Action Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Идёт расчёт...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 stroke-[3]" />
                <span>АНАЛИЗИРОВАТЬ ТОВАР</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


