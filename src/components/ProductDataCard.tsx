import React from 'react';
import {
  Package,
  Tag,
  Layers,
  Users,
  Box,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Store,
  Info,
} from 'lucide-react';
import { ProductData } from '../types.ts';

interface ProductDataCardProps {
  product: ProductData | null;
  loading: boolean;
  error?: string | null;
}

export const ProductDataCard: React.FC<ProductDataCardProps> = ({
  product,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-sm animate-pulse">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-amber-500/20 rounded w-20"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-5 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="h-12 bg-slate-800/60 rounded-xl"></div>
            <div className="h-12 bg-slate-800/60 rounded-xl"></div>
            <div className="h-12 bg-slate-800/60 rounded-xl"></div>
            <div className="h-12 bg-slate-800/60 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-4 text-xs text-rose-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-rose-200">Не удалось загрузить данные о товаре:</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const formatWeight = () => {
    if (!product.weight) return 'Не указан';
    if (typeof product.weight === 'object' && product.weight !== null) {
      return `${product.weight.value ?? '-'} ${product.weight.unit ?? 'lbs'}`;
    }
    return `${product.weight} lbs`;
  };

  const formatDimensions = () => {
    if (!product.dimensions) return 'Не указаны';
    if (typeof product.dimensions === 'object' && product.dimensions !== null) {
      const { length, width, height, unit } = product.dimensions;
      return `${length ?? '-'} × ${width ?? '-'} × ${height ?? '-'} ${unit ?? 'in'}`;
    }
    return String(product.dimensions);
  };

  const getRestrictionsBadge = () => {
    if (!product.sellingRestrictions) {
      return {
        label: 'Без ограничений',
        isRestricted: false,
      };
    }
    if (typeof product.sellingRestrictions === 'object' && !Array.isArray(product.sellingRestrictions)) {
      const isGated = product.sellingRestrictions.isGated || product.sellingRestrictions.approvalRequired;
      const hazmat = product.sellingRestrictions.hazmat;
      if (isGated || hazmat) {
        return {
          label: hazmat ? 'Hazmat / Опасно' : 'Требуется разрешение (Gated)',
          isRestricted: true,
        };
      }
      return {
        label: 'Доступно для продажи',
        isRestricted: false,
      };
    }
    return {
      label: 'Без ограничений',
      isRestricted: false,
    };
  };

  const restrictions = getRestrictionsBadge();

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Header & Mock badge */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Данные о товаре Amazon
          </h3>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold border border-slate-700">
            {product.asin}
          </span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
          <Info className="w-3 h-3" /> MOCK DATA
        </span>
      </div>

      {/* Title & Brand / Category */}
      <div>
        <h4 className="text-sm font-bold text-slate-100 leading-snug">
          {product.title || 'Товар без названия'}
        </h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
          {product.brand && (
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Tag className="w-3 h-3 text-amber-400" /> {product.brand}
            </span>
          )}
          {product.category && (
            <span className="flex items-center gap-1 text-slate-400 truncate max-w-xs">
              <Layers className="w-3 h-3 text-slate-500" /> {product.category}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Key Amazon Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {/* Buy Box & Current Price */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Buy Box Цена</span>
          <span className="text-sm font-bold text-slate-100 mt-0.5 block">
            ${product.buyBoxPrice ? product.buyBoxPrice.toFixed(2) : (product.currentPrice ? product.currentPrice.toFixed(2) : '—')}
          </span>
        </div>

        {/* BSR */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">BSR (Рейтинг)</span>
          <span className="text-sm font-bold text-amber-400 mt-0.5 block">
            #{product.bsr ? product.bsr.toLocaleString() : '—'}
          </span>
        </div>

        {/* Estimated Monthly Sales */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Продажи в мес.</span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block flex items-center justify-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {product.estimatedMonthlySales ? `~${product.estimatedMonthlySales} шт.` : '—'}
          </span>
        </div>

        {/* Amazon as Seller */}
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-medium block">Amazon как продавец</span>
          <span
            className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${
              product.amazonAsSeller ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            <Store className="w-3 h-3" />
            {product.amazonAsSeller ? 'Да (Риск)' : 'Нет'}
          </span>
        </div>
      </div>

      {/* Detailed Meta: Sellers, Specs, Restrictions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
        {/* Sellers Breakdown */}
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>Продавцы ({product.numberOfSellers ?? 0})</span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-0.5">
            <div>FBA: <strong className="text-amber-400">{product.fbaSellers ?? 0}</strong></div>
            <div>FBM: <strong className="text-slate-400">{product.fbmSellers ?? 0}</strong></div>
          </div>
        </div>

        {/* Physical Specs */}
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1">
            <Box className="w-3 h-3 text-slate-400" />
            <span>Габариты и вес</span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-0.5">
            <div className="truncate" title={formatDimensions()}>Размеры: {formatDimensions()}</div>
            <div>Вес: {formatWeight()}</div>
          </div>
        </div>

        {/* Selling Restrictions */}
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            <span>Ограничения</span>
          </div>
          <div className="text-[11px]">
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                restrictions.isRestricted
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {restrictions.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
