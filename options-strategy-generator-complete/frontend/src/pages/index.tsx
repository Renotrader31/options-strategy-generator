'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUpIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import StrategyCard from '@/components/StrategyCard';
import SearchForm from '@/components/SearchForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Strategy, ScanRequest } from '@/types/strategy';

export default function HomePage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTicker, setCurrentTicker] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleScan = async (request: ScanRequest) => {
    setLoading(true);
    setCurrentTicker(request.ticker);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStrategies(data.strategies);
        setCurrentPrice(data.currentPrice);
        toast.success(`Found ${data.strategies.length} strategies for ${request.ticker}`);
      } else {
        throw new Error(data.error || 'Failed to fetch strategies');
      }
    } catch (error) {
      console.error('Error scanning strategies:', error);
      toast.error('Failed to fetch strategies. Please try again.');
      setStrategies([]);
      setCurrentPrice(null);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    if (confidence >= 50) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Options Strategy Generator
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Polygon API
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Options Strategy
            </h2>
            <SearchForm onScan={handleScan} loading={loading} />
          </div>
        </motion.div>

        {/* Current Stock Info */}
        <AnimatePresence>
          {currentTicker && currentPrice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentTicker}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-lg font-bold text-green-600">
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <LoadingSpinner />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                Analyzing strategies for {currentTicker}...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strategies Grid */}
        <AnimatePresence>
          {strategies.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recommended Strategies ({strategies.length})
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Ranked by confidence
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {strategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <StrategyCard 
                      strategy={strategy} 
                      rank={index + 1}
                      confidenceColor={getConfidenceColor(strategy.confidence)}
                      confidenceIcon={getConfidenceIcon(strategy.confidence)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && strategies.length === 0 && currentTicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Strategies Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No viable strategies found for {currentTicker}. Try a different ticker or adjust your parameters.
            </p>
          </motion.div>
        )}

        {/* Welcome State */}
        {!loading && strategies.length === 0 && !currentTicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TrendingUpIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Options Strategy Generator
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover the best options strategies tailored to your risk profile. 
              Enter a stock ticker above to get started with real-time analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Live market data and options chains from Polygon API
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <TrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">20+ Strategies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive coverage from basic to advanced strategies
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Risk Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confidence scoring tailored to your risk profile
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
