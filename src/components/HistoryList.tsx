import React, { useState, useRef, useEffect } from 'react';
import { History, Trash2, ArrowUpRight, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductInput } from '../types.ts';

export interface HistoryItem {
  id: string;
  title: string;
  asin?: string;
  input: {
    purchasePrice: number;
    sellingPrice: number;
    amazonFees: number;
    fbaFee: number;
    shipping: number;
  };
  result: {
    profit: number;
    roi: number;
    decision: 'BUY' | "DON'T BUY";
  };
  createdAt: string;
}

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (input: ProductInput) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmClear) {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      setConfirmClear(false);
      onClear();
    } else {
      setConfirmClear(true);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearTimerRef.current = setTimeout(() => {
        setConfirmClear(false);
      }, 3500);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-slate-100 transition cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>История проверок ({items.length})</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {isOpen && (
          <button
            type="button"
            onClick={handleClearClick}
            className={`text-[11px] flex items-center gap-1 transition px-2 py-0.5 rounded cursor-pointer ${
              confirmClear
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title={confirmClear ? 'Нажмите ещё раз для подтверждения' : 'Очистить историю'}
          >
            <Trash2 className="w-3 h-3" />
            <span>{confirmClear ? 'Точно удалить?' : 'Очистить'}</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {items.map((item) => {
            const isBuy = item.result.decision === 'BUY';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onSelect({
                    title: item.title,
                    asin: item.asin,
                    purchasePrice: item.input.purchasePrice,
                    sellingPrice: item.input.sellingPrice,
                    amazonFees: item.input.amazonFees,
                    fbaFee: item.input.fbaFee,
                    shipping: item.input.shipping,
                  })
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 hover:border-amber-500/40 hover:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition cursor-pointer group flex items-center justify-between gap-2"
                title="Загрузить параметры"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-200 truncate group-hover:text-amber-300 transition">
                      {item.title}
                    </span>
                    {item.asin && (
                      <span className="text-[9px] px-1 py-[1px] bg-slate-800/80 text-slate-400 rounded font-mono">
                        {item.asin}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2.5 flex-wrap">
                    <span>${item.input.purchasePrice.toFixed(2)} → ${item.input.sellingPrice.toFixed(2)}</span>
                    <span>
                      Прибыль:{' '}
                      <strong className={isBuy ? 'text-emerald-400' : 'text-rose-400'}>
                        {item.result.profit > 0
                          ? `+$${item.result.profit.toFixed(2)}`
                          : item.result.profit < 0
                          ? `-$${Math.abs(item.result.profit).toFixed(2)}`
                          : `$0.00`}
                      </strong>
                    </span>
                    <span>ROI: <strong>{item.result.roi.toFixed(1)}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isBuy
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isBuy ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                    {isBuy ? 'ПОКУПАТЬ' : 'НЕ ПОКУПАТЬ'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


