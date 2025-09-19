export interface Strategy {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'volatility';
  confidence: number;
  maxProfit: number;
  maxLoss: number;
  capitalRequired: number;
  probabilityOfProfit?: number;
  description?: string;
}

export interface ScanRequest {
  ticker: string;
  riskProfile: 'conservative' | 'moderate' | 'moderate_aggressive' | 'aggressive';
  minDte?: number;
  maxDte?: number;
  maxStrategies?: number;
}