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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mr-3">
            #{rank}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {strategy.name}
            </h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStrategyTypeColor(strategy.type)}`}>
              {getStrategyTypeIcon(strategy.type)}
              <span className="ml-1">{strategy.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {confidenceIcon}
          <span className={`ml-1 font-semibold ${confidenceColor}`}>
            {strategy.confidence.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Max Profit:</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(strategy.maxProfit)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Max Loss:</span>
          <span className="font-semibold text-red-600">
            {formatCurrency(Math.abs(strategy.maxLoss))}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Capital Required:</span>
          <span className="font-semibold text-blue-600">
            {formatCurrency(strategy.capitalRequired)}
          </span>
        </div>

        {strategy.probabilityOfProfit && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Prob. of Profit:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {(strategy.probabilityOfProfit * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {strategy.description && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {strategy.description}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-4">
        <motion.button
          whileHover={{ backgroundColor: 'rgb(59, 130, 246)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <CurrencyDollarIcon className="w-4 h-4 mr-2" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
}
