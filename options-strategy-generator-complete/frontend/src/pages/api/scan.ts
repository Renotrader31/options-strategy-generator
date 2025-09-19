import type { NextApiRequest, NextApiResponse } from 'next';

interface ScanRequest {
  ticker: string;
  riskProfile: string;
  minDte?: number;
  maxDte?: number;
  maxStrategies?: number;
}

interface Strategy {
  id: string;
  name: string;
  type: string;
  confidence: number;
  maxProfit: number;
  maxLoss: number;
  capitalRequired: number;
  probabilityOfProfit?: number;
  description?: string;
}

interface ScanResponse {
  success: boolean;
  strategies: Strategy[];
  currentPrice: number;
  ticker: string;
  error?: string;
}

// Mock data for demonstration
const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Bull Put Spread',
    type: 'bullish',
    confidence: 73.2,
    maxProfit: 850,
    maxLoss: -150,
    capitalRequired: 150,
    probabilityOfProfit: 0.68,
    description: 'A bullish strategy that profits from upward price movement with limited risk.'
  },
  {
    id: '2',
    name: 'Covered Call',
    type: 'neutral',
    confidence: 68.5,
    maxProfit: 420,
    maxLoss: -2000,
    capitalRequired: 15000,
    probabilityOfProfit: 0.72,
    description: 'Generate income by selling calls against existing stock positions.'
  },
  {
    id: '3',
    name: 'Iron Condor',
    type: 'neutral',
    confidence: 65.1,
    maxProfit: 320,
    maxLoss: -180,
    capitalRequired: 180,
    probabilityOfProfit: 0.58,
    description: 'Profit from sideways price movement with defined risk and reward.'
  },
  {
    id: '4',
    name: 'Cash Secured Put',
    type: 'bullish',
    confidence: 62.8,
    maxProfit: 250,
    maxLoss: -4750,
    capitalRequired: 5000,
    probabilityOfProfit: 0.65,
    description: 'Generate income while potentially acquiring stock at a discount.'
  },
  {
    id: '5',
    name: 'Long Straddle',
    type: 'volatility',
    confidence: 58.3,
    maxProfit: 99999,
    maxLoss: -480,
    capitalRequired: 480,
    probabilityOfProfit: 0.45,
    description: 'Profit from large price movements in either direction.'
  }
];

// Mock current prices for different tickers
const mockPrices: { [key: string]: number } = {
  'AAPL': 175.50,
  'SPY': 425.30,
  'TSLA': 245.80,
  'MSFT': 342.15,
  'NVDA': 456.70,
  'META': 298.45,
  'GOOGL': 138.25,
  'AMZN': 145.60
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ScanResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      strategies: [],
      currentPrice: 0,
      ticker: '',
      error: 'Method not allowed'
    });
  }

  try {
    const { ticker, riskProfile, minDte = 30, maxDte = 45, maxStrategies = 10 }: ScanRequest = req.body;

    if (!ticker) {
      return res.status(400).json({
        success: false,
        strategies: [],
        currentPrice: 0,
        ticker: '',
        error: 'Ticker is required'
      });
    }

    const upperTicker = ticker.toUpperCase();
    const currentPrice = mockPrices[upperTicker] || 100 + Math.random() * 200;

    // Filter strategies based on risk profile
    let filteredStrategies = [...mockStrategies];
    
    switch (riskProfile) {
      case 'conservative':
        filteredStrategies = mockStrategies.filter(s => s.confidence >= 65);
        break;
      case 'moderate':
        filteredStrategies = mockStrategies.filter(s => s.confidence >= 60);
        break;
      case 'moderate_aggressive':
        filteredStrategies = mockStrategies.filter(s => s.confidence >= 55);
        break;
      case 'aggressive':
        // Include all strategies
        break;
    }

    // Sort by confidence and limit results
    const strategies = filteredStrategies
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxStrategies)
      .map(strategy => ({
        ...strategy,
        // Add some randomization to make it feel more realistic
        confidence: strategy.confidence + (Math.random() - 0.5) * 5,
        maxProfit: Math.round(strategy.maxProfit * (0.8 + Math.random() * 0.4)),
        maxLoss: Math.round(strategy.maxLoss * (0.8 + Math.random() * 0.4))
      }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    res.status(200).json({
      success: true,
      strategies,
      currentPrice,
      ticker: upperTicker
    });

  } catch (error) {
    console.error('Error in scan API:', error);
    res.status(500).json({
      success: false,
      strategies: [],
      currentPrice: 0,
      ticker: '',
      error: 'Internal server error'
    });
  }
}