import React, { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2.5 sm:py-0 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <ShoppingBag className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight truncate">
                Amazon Product Analyzer
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
                FBA Калькулятор
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400 truncate">
              Проверьте товар перед покупкой и рассчитайте чистую прибыль
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected !== null && (
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs border transition ${
                isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
              title={isConnected ? 'Сервис анализа активен и готов к работе' : 'Сервис анализа недоступен'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="hidden md:inline font-medium">
                {isConnected ? 'Сервис активен' : 'Офлайн'}
              </span>
            </div>
          )}
          <button
            onClick={checkHealth}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Обновить статус"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

