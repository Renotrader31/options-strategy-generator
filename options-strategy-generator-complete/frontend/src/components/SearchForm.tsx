import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ScanRequest } from '@/types/strategy';

interface SearchFormProps {
  onScan: (request: ScanRequest) => void;
  loading: boolean;
}

export default function SearchForm({ onScan, loading }: SearchFormProps) {
  const [ticker, setTicker] = useState('');
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive'>('moderate_aggressive');
  const [minDte, setMinDte] = useState(30);
  const [maxDte, setMaxDte] = useState(45);
  const [maxStrategies, setMaxStrategies] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    const request: ScanRequest = {
      ticker: ticker.toUpperCase().trim(),
      riskProfile,
      minDte,
      maxDte,
      maxStrategies,
    };

    onScan(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Ticker
          </label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., AAPL, SPY, TSLA)"
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
            maxLength={10}
          />
        </div>

        <div className="sm:w-48">
          <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Profile
          </label>
          <select
            id="riskProfile"
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value as any)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="moderate_aggressive">Moderate Aggressive</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div className="sm:w-32">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            &nbsp;
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !ticker.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Scan
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          disabled={loading}
        >
          <Cog6ToothIcon className="w-4 h-4 mr-1" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      {/* Advanced Options */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showAdvanced ? 1 : 0, 
          height: showAdvanced ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div>
              <label htmlFor="minDte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min DTE
              </label>
              <input
                type="number"
                id="minDte"
                value={minDte}
                onChange={(e) => setMinDte(Number(e.target.value))}
                min="1"
                max="365"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="maxDte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max DTE
              </label>
              <input
                type="number"
                id="maxDte"
                value={maxDte}
                onChange={(e) => setMaxDte(Number(e.target.value))}
                min="1"
                max="365"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="maxStrategies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Results
              </label>
              <input
                type="number"
                id="maxStrategies"
                value={maxStrategies}
                onChange={(e) => setMaxStrategies(Number(e.target.value))}
                min="1"
                max="20"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
          </div>
        )}
      </motion.div>
    </form>
  );
}
