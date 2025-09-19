import type { NextApiRequest, NextApiResponse } from 'next';

interface QuoteResponse {
  success: boolean;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  error?: string;
}

// Mock prices and data
const mockData: { [key: string]: QuoteResponse } = {
  'AAPL': {
    success: true,
    ticker: 'AAPL',
    price: 175.50,
    change: 2.34,
    changePercent: 1.35,
    volume: 45678900
  },
  'SPY': {
    success: true,
    ticker: 'SPY',
    price: 425.30,
    change: -1.25,
    changePercent: -0.29,
    volume: 23456780
  },
  'TSLA': {
    success: true,
    ticker: 'TSLA',
    price: 245.80,
    change: 5.67,
    changePercent: 2.36,
    volume: 67890123
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<QuoteResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      ticker: '',
      price: 0,
      change: 0,
      changePercent: 0,
      error: 'Method not allowed'
    });
  }

  try {
    const { ticker } = req.query;
    
    if (!ticker || typeof ticker !== 'string') {
      return res.status(400).json({
        success: false,
        ticker: '',
        price: 0,
        change: 0,
        changePercent: 0,
        error: 'Valid ticker is required'
      });
    }

    const upperTicker = ticker.toUpperCase();
    
    // Return mock data if available, otherwise generate random data
    const mockQuote = mockData[upperTicker];
    
    if (mockQuote) {
      res.status(200).json(mockQuote);
    } else {
      // Generate random quote data
      const basePrice = 50 + Math.random() * 300;
      const change = (Math.random() - 0.5) * 10;
      const changePercent = (change / basePrice) * 100;
      
      res.status(200).json({
        success: true,
        ticker: upperTicker,
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(1000000 + Math.random() * 50000000)
      });
    }

  } catch (error) {
    console.error('Error in quote API:', error);
    res.status(500).json({
      success: false,
      ticker: '',
      price: 0,
      change: 0,
      changePercent: 0,
      error: 'Internal server error'
    });
  }
}