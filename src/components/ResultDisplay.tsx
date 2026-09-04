import React from 'react';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  PieChart,
  HelpCircle,
} from 'lucide-react';
import { ProductAnalysisResult, ProductInput } from '../types.ts';

interface ResultDisplayProps {
  result: ProductAnalysisResult | null;
  input: ProductInput;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, input }) => {
  if (!result) {
    return (
      <div className="bg-slate-900/90 border border-dashed border-slate-800/80 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[360px] shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-800/70 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
          <PieChart className="w-6 h-6 text-amber-400/80" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200">Результат анализа</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
          Заполните параметры слева и нажмите <strong>«АНАЛИЗИРОВАТЬ ТОВАР»</strong>, чтобы получить вердикт, прибыль и ROI.
        </p>
      </div>
    );
  }

  const isBuy = result.decision === 'BUY';
  const sellingPrice = Number(input.sellingPrice) || 0;
  const purchasePrice = Number(input.purchasePrice) || 0;
  const amazonFees = Number(input.amazonFees) || 0;
  const fbaFee = Number(input.fbaFee) || 0;
  const shipping = Number(input.shipping) || 0;

  // Visual breakdown calculation
  const safeSelling = sellingPrice > 0 ? sellingPrice : result.totalCosts + Math.max(0, result.profit);
  const pPricePct = Math.min(100, Math.max(0, (purchasePrice / safeSelling) * 100));
  const aFeesPct = Math.min(100, Math.max(0, (amazonFees / safeSelling) * 100));
  const fFeePct = Math.min(100, Math.max(0, (fbaFee / safeSelling) * 100));
  const shipPct = Math.min(100, Math.max(0, (shipping / safeSelling) * 100));
  const profitPct = result.profit > 0 ? Math.min(100, (result.profit / safeSelling) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 1. ГЛАВНЫЙ ВЕРДИКТ: Огромный и максимально понятный */}
      <div
        className={`rounded-2xl p-6 sm:p-7 border transition-all text-center ${
          isBuy
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-xl shadow-emerald-950/40'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-100 shadow-xl shadow-rose-950/40'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {isBuy ? (
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400 shrink-0" aria-hidden="true" />
          )}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase whitespace-nowrap">
            {isBuy ? 'ПОКУПАТЬ' : 'НЕ ПОКУПАТЬ'}
          </h2>
        </div>

        {/* Главные показатели прямо под решением */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Чистая прибыль
            </span>
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
                result.profit > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.profit > 0
                ? `+$${result.profit.toFixed(2)}`
                : result.profit < 0
                ? `-$${Math.abs(result.profit).toFixed(2)}`
                : `$${result.profit.toFixed(2)}`}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">с 1 единицы</span>
          </div>

          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              ROI (Окупаемость)
            </span>
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight flex items-center justify-center gap-1 ${
                result.roi >= 30
                  ? 'text-emerald-400'
                  : result.roi > 0
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {result.roi >= 30 ? (
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 -mr-0.5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 -mr-0.5" aria-hidden="true" />
              )}
              <span>{result.roi.toFixed(1)}%</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {result.roi >= 30 ? 'цель достигнута (≥30%)' : 'ниже нормы (<30%)'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ВТОРИЧНЫЕ ПОКАЗАТЕЛИ (Визуально менее заметные) */}
      <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-3 sm:p-3.5">
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800">
          <div>
            <span className="text-[11px] text-slate-500 block">Все расходы</span>
            <span className="text-sm font-semibold text-slate-300 mt-0.5 block">
              ${result.totalCosts.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Инвестиция</span>
            <span className="text-sm font-semibold text-slate-300 mt-0.5 block">
              ${result.investment.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">Маржа</span>
            <span className="text-sm font-semibold text-slate-300 mt-0.5 block">
              {result.profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. «ПОЧЕМУ ТАКОЕ РЕШЕНИЕ?» (Простой и понятный) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-2.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Почему такое решение?</span>
        </div>

        {isBuy ? (
          <div className="space-y-2">
            <div className="space-y-1 text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-sm">✓</span>
                <span>ROI выше 30% ({result.roi.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-sm">✓</span>
                <span>Прибыль положительная (+${result.profit.toFixed(2)})</span>
              </div>
            </div>
            <p className="text-slate-400 pt-1.5 border-t border-slate-800/60 font-medium">
              Товар соответствует заданным критериям.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="space-y-1 text-slate-200">
              <div className="flex items-center gap-2">
                <span className={result.roi < 30 ? 'text-rose-400 font-bold text-sm' : 'text-emerald-400 font-bold text-sm'}>
                  {result.roi < 30 ? '✕' : '✓'}
                </span>
                <span>
                  {result.roi < 30 ? `ROI ниже 30% (${result.roi.toFixed(1)}%)` : `ROI выше 30% (${result.roi.toFixed(1)}%)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={result.profit <= 0 ? 'text-rose-400 font-bold text-sm' : 'text-emerald-400 font-bold text-sm'}>
                  {result.profit <= 0 ? '✕' : '✓'}
                </span>
                <span>
                  {result.profit < 0
                    ? `Прибыль отрицательная (-$${Math.abs(result.profit).toFixed(2)})`
                    : result.profit === 0
                    ? 'Прибыль нулевая ($0.00)'
                    : `Прибыль положительная (+$${result.profit.toFixed(2)})`}
                </span>
              </div>
            </div>
            <p className="text-slate-400 pt-1.5 border-t border-slate-800/60 font-medium">
              Товар не соответствует заданным критериям.
            </p>
          </div>
        )}
      </div>

      {/* 4. КОМПАКТНАЯ СТРУКТУРА ЦЕНЫ (Помогает понять, куда уходят деньги) */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex justify-between items-center text-[11px] mb-2 text-slate-400">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <PieChart className="w-3 h-3 text-amber-400" />
            Куда уходят деньги (Цена: ${sellingPrice.toFixed(2)})
          </span>
          <span>100%</span>
        </div>

        {/* Progress Bar with robust rounded clipping */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden flex gap-0.5">
            <div
              style={{ width: `${pPricePct}%` }}
              className="bg-indigo-400 shrink-0"
              title={`Закупка: $${purchasePrice.toFixed(2)}`}
            />
            <div
              style={{ width: `${aFeesPct}%` }}
              className="bg-amber-500 shrink-0"
              title={`Amazon: $${amazonFees.toFixed(2)}`}
            />
            <div
              style={{ width: `${fFeePct}%` }}
              className="bg-orange-500 shrink-0"
              title={`FBA: $${fbaFee.toFixed(2)}`}
            />
            <div
              style={{ width: `${shipPct}%` }}
              className="bg-slate-500 shrink-0"
              title={`Доставка: $${shipping.toFixed(2)}`}
            />
            {result.profit > 0 ? (
              <div
                style={{ width: `${profitPct}%` }}
                className="bg-emerald-400 shrink-0"
                title={`Прибыль: $${result.profit.toFixed(2)}`}
              />
            ) : null}
          </div>
        </div>

        {/* Legend in structured responsive grid */}
        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5 text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-xs bg-indigo-400 shrink-0" />
            <span>Закупка: ${purchasePrice.toFixed(2)}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-xs bg-amber-500 shrink-0" />
            <span>Amazon: ${amazonFees.toFixed(2)}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-xs bg-orange-500 shrink-0" />
            <span>FBA: ${fbaFee.toFixed(2)}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-xs bg-slate-500 shrink-0" />
            <span>Доставка: ${shipping.toFixed(2)}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate text-emerald-400 font-semibold col-span-2 sm:col-span-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-400 shrink-0" />
            <span>
              Прибыль:{' '}
              {result.profit > 0
                ? `+$${result.profit.toFixed(2)}`
                : result.profit < 0
                ? `-$${Math.abs(result.profit).toFixed(2)}`
                : `$0.00`}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};


