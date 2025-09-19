import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon, 
  MinusIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { Strategy } from '@/types/strategy';

interface StrategyCardProps {
  strategy: Strategy;
  rank: number;
  confidenceColor: string;
  confidenceIcon: React.ReactNode;
}

export default function StrategyCard({ strategy, rank, confidenceColor, confidenceIcon }: StrategyCardProps) {
  const getStrategyTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bullish':
        return <TrendingUpIcon className="w-5 h-5 text-green-600" />;
      case 'bearish':
        return <TrendingDownIcon className="w-5 h-5 text-red-600" />;
      case 'neutral':
        return <MinusIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bullish':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'volatility':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card-elevated p-6 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              #{rank}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {strategy.name}
            </h3>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStrategyTypeColor(strategy.type)}`}>
              {getStrategyTypeIcon(strategy.type)}
              <span className="ml-2 capitalize">{strategy.type}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1 mb-1">
            {confidenceIcon}
            <span className={`font-bold text-lg ${confidenceColor}`}>
              {strategy.confidence.toFixed(1)}%
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Confidence</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-xs font-semibold text-emerald-600 mb-1">Max Profit</div>
          <div className="text-lg font-bold text-emerald-700">
            {formatCurrency(strategy.maxProfit)}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <div className="text-xs font-semibold text-red-600 mb-1">Max Loss</div>
          <div className="text-lg font-bold text-red-700">
            {formatCurrency(Math.abs(strategy.maxLoss))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="text-xs font-semibold text-blue-600 mb-1">Capital Required</div>
          <div className="text-lg font-bold text-blue-700">
            {formatCurrency(strategy.capitalRequired)}
          </div>
        </div>

        {strategy.probabilityOfProfit && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="text-xs font-semibold text-purple-600 mb-1">Prob. of Profit</div>
            <div className="text-lg font-bold text-purple-700">
              {(strategy.probabilityOfProfit * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {strategy.description && (
        <div className="mb-6">
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
            {strategy.description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full btn-primary group-hover:shadow-lg transition-all duration-200"
      >
        <CurrencyDollarIcon className="w-5 h-5 mr-2" />
        <span>View Strategy Details</span>
      </motion.button>
    </motion.div>
  );
}
