'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { Strategy, ScanRequest } from '@/types/strategy'

const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Bull Put Spread',
    type: 'bullish',
    confidence: 78.5,
    maxProfit: 850,
    maxLoss: -150,
    capitalRequired: 150,
    probabilityOfProfit: 0.72,
    description: 'A bullish strategy that profits from upward price movement with limited risk.'
  },
  {
    id: '2',
    name: 'Iron Condor',
    type: 'neutral',
    confidence: 65.2,
    maxProfit: 320,
    maxLoss: -180,
    capitalRequired: 180,
    probabilityOfProfit: 0.58,
    description: 'Profit from sideways price movement with defined risk.'
  },
  {
    id: '3',
    name: 'Covered Call',
    type: 'neutral',
    confidence: 71.8,
    maxProfit: 420,
    maxLoss: -2000,
    capitalRequired: 15000,
    probabilityOfProfit: 0.75,
    description: 'Generate income by selling calls against stock positions.'
  }
]

export default function Home() {
  const [ticker, setTicker] = useState('')
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker.trim()) return

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const randomPrice = 100 + Math.random() * 200
      setCurrentPrice(randomPrice)
      setStrategies(mockStrategies)
      setLoading(false)
      toast.success(`Found ${mockStrategies.length} strategies for ${ticker.toUpperCase()}`)
    }, 1500)
  }

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`
    }
    return `$${Math.abs(amount).toFixed(0)}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Options Strategy Generator</h1>
              <p className="text-slate-600">AI-powered options analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Find Your Perfect 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Options Strategy</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover AI-powered options strategies tailored to your risk profile with real-time market analysis
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-8 mb-12"
        >
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter ticker (e.g., AAPL, SPY, TSLA)"
                className="input text-lg w-full"
                disabled={loading}
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !ticker.trim()}
              className="btn-primary flex items-center justify-center px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              ) : (
                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
              )}
              {loading ? 'Analyzing...' : 'Analyze Strategies'}
            </button>
          </form>
        </motion.div>

        {/* Current Price */}
        {currentPrice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{ticker.toUpperCase()}</h3>
                <p className="text-slate-600">Current Analysis</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  ${currentPrice.toFixed(2)}
                </div>
                <div className="flex items-center justify-end mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-500">Real-time</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Strategies */}
        {strategies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Recommended Strategies</h3>
              <p className="text-slate-600">{strategies.length} strategies found, ranked by confidence</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {strategies.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{strategy.name}</h4>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        strategy.type === 'bullish' ? 'bg-emerald-100 text-emerald-800' :
                        strategy.type === 'bearish' ? 'bg-red-100 text-red-800' :
                        strategy.type === 'neutral' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {strategy.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{strategy.confidence.toFixed(1)}%</div>
                      <div className="text-xs text-slate-500">Confidence</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <div className="text-xs text-emerald-600 font-semibold">Max Profit</div>
                      <div className="text-lg font-bold text-emerald-700">{formatCurrency(strategy.maxProfit)}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-xs text-red-600 font-semibold">Max Loss</div>
                      <div className="text-lg font-bold text-red-700">{formatCurrency(strategy.maxLoss)}</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                    {strategy.description}
                  </p>

                  <button className="w-full btn-primary">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Welcome State */}
        {strategies.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to analyze options strategies?
            </h3>
            <p className="text-slate-600 mb-8">
              Enter a stock ticker above to get started with AI-powered strategy recommendations
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}