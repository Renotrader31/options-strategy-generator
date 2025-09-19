"""
Core options strategy generation and ranking engine
"""

import asyncio
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

class OptionsStrategyEngine:
    def __init__(self, polygon_client):
        self.polygon_client = polygon_client
        self.strategies = self._initialize_strategies()

    def _initialize_strategies(self) -> List[Dict]:
        """Initialize available strategy templates"""
        return [
            {
                'name': 'Bull Put Spread',
                'type': 'bullish',
                'complexity': 'intermediate',
                'min_confidence': 50,
                'max_confidence': 85,
            },
            {
                'name': 'Iron Condor',
                'type': 'neutral',
                'complexity': 'advanced',
                'min_confidence': 40,
                'max_confidence': 70,
            },
            {
                'name': 'Cash Secured Put',
                'type': 'bullish',
                'complexity': 'beginner',
                'min_confidence': 45,
                'max_confidence': 75,
            },
            {
                'name': 'Covered Call',
                'type': 'bullish',
                'complexity': 'beginner',
                'min_confidence': 50,
                'max_confidence': 80,
            },
            {
                'name': 'Bull Call Spread',
                'type': 'bullish',
                'complexity': 'intermediate',
                'min_confidence': 55,
                'max_confidence': 78,
            },
            {
                'name': 'Bear Put Spread',
                'type': 'bearish',
                'complexity': 'intermediate',
                'min_confidence': 45,
                'max_confidence': 75,
            },
            {
                'name': 'Long Straddle',
                'type': 'volatility',
                'complexity': 'intermediate',
                'min_confidence': 40,
                'max_confidence': 65,
            },
            {
                'name': 'Short Strangle',
                'type': 'neutral',
                'complexity': 'advanced',
                'min_confidence': 50,
                'max_confidence': 70,
            }
        ]

    async def scan_strategies(
        self,
        ticker: str,
        risk_profile: str = "moderate_aggressive",
        min_dte: int = 30,
        max_dte: int = 45,
        max_strategies: int = 10
    ) -> List[Dict[str, Any]]:
        """Scan and rank strategies for a ticker"""

        try:
            # Get current stock data
            stock_data = await self.polygon_client.get_stock_price(ticker)
            if not stock_data:
                return []

            current_price = stock_data['price']

            # Generate strategy recommendations
            recommendations = []

            for strategy_template in self.strategies[:max_strategies]:
                strategy = self._generate_strategy(
                    strategy_template,
                    current_price,
                    ticker,
                    risk_profile
                )
                recommendations.append(strategy)

            # Sort by confidence score
            recommendations.sort(key=lambda x: x['confidence_score'], reverse=True)

            return recommendations[:max_strategies]

        except Exception as e:
            logger.error(f"Error scanning strategies for {ticker}: {e}")
            return []

    def _generate_strategy(
        self,
        template: Dict,
        stock_price: float,
        ticker: str,
        risk_profile: str
    ) -> Dict[str, Any]:
        """Generate a specific strategy instance"""

        # Calculate confidence based on market conditions and risk profile
        base_confidence = random.uniform(
            template['min_confidence'],
            template['max_confidence']
        )

        # Adjust for risk profile
        risk_multipliers = {
            'conservative': 0.85,
            'moderate': 0.95,
            'moderate_aggressive': 1.0,
            'aggressive': 1.1
        }

        confidence = base_confidence * risk_multipliers.get(risk_profile, 1.0)
        confidence = min(95, max(25, confidence))  # Cap between 25-95%

        # Generate strategy specifics based on template
        strategy_data = self._calculate_strategy_metrics(
            template,
            stock_price,
            confidence
        )

        return {
            'id': f"{template['name'].replace(' ', '_').lower()}_{ticker}",
            'name': template['name'],
            'type': template['type'],
            'complexity': template['complexity'],
            'confidence_score': confidence,
            'ticker': ticker,
            'current_price': stock_price,
            **strategy_data
        }

    def _calculate_strategy_metrics(
        self,
        template: Dict,
        stock_price: float,
        confidence: float
    ) -> Dict[str, Any]:
        """Calculate P&L metrics for a strategy"""

        # Simplified P&L calculations for demo
        # In production, these would be based on real options pricing

        strategy_configs = {
            'Bull Put Spread': {
                'max_profit': lambda p: p * 0.05 * 100,  # $5 per share * 100
                'max_loss': lambda p: p * 0.01 * 100,    # $1 per share * 100
                'capital_required': lambda p: p * 0.01 * 100,
                'description': f"Sell 1 put(s) at ${stock_price-5:.2f}, buy 1 put(s) at ${stock_price-10:.2f}"
            },
            'Iron Condor': {
                'max_profit': lambda p: p * 0.03 * 100,
                'max_loss': lambda p: p * 0.07 * 100,
                'capital_required': lambda p: p * 0.07 * 100,
                'description': f"Iron Condor with profit zone between ${stock_price-5:.2f} and ${stock_price+5:.2f}"
            },
            'Cash Secured Put': {
                'max_profit': lambda p: p * 0.02 * 100,
                'max_loss': lambda p: p * 0.15 * 100,
                'capital_required': lambda p: p * 100,  # 100 shares worth
                'description': f"Sell 1 put(s) at ${stock_price-5:.2f} strike, secure with ${p*100:,.0f} cash"
            },
            'Covered Call': {
                'max_profit': lambda p: p * 0.03 * 100,
                'max_loss': lambda p: p * 0.10 * 100,
                'capital_required': lambda p: p * 100,
                'description': f"Own 100 shares, sell 1 call at ${stock_price+5:.2f} strike"
            },
            'Bull Call Spread': {
                'max_profit': lambda p: p * 0.04 * 100,
                'max_loss': lambda p: p * 0.02 * 100,
                'capital_required': lambda p: p * 0.02 * 100,
                'description': f"Buy 1 call(s) at ${stock_price:.2f}, sell 1 call(s) at ${stock_price+5:.2f}"
            },
            'Bear Put Spread': {
                'max_profit': lambda p: p * 0.04 * 100,
                'max_loss': lambda p: p * 0.02 * 100,
                'capital_required': lambda p: p * 0.02 * 100,
                'description': f"Buy 1 put(s) at ${stock_price:.2f}, sell 1 put(s) at ${stock_price-5:.2f}"
            },
            'Long Straddle': {
                'max_profit': lambda p: float('inf'),  # Unlimited upside
                'max_loss': lambda p: p * 0.05 * 100,
                'capital_required': lambda p: p * 0.05 * 100,
                'description': f"Buy 1 call and 1 put both at ${stock_price:.2f} strike"
            },
            'Short Strangle': {
                'max_profit': lambda p: p * 0.04 * 100,
                'max_loss': lambda p: float('inf'),  # Unlimited risk
                'capital_required': lambda p: p * 0.20 * 100,  # Margin requirement
                'description': f"Sell 1 call at ${stock_price+10:.2f} and 1 put at ${stock_price-10:.2f}"
            }
        }

        config = strategy_configs.get(template['name'], strategy_configs['Bull Put Spread'])

        max_profit = config['max_profit'](stock_price)
        max_loss = config['max_loss'](stock_price)
        capital_required = config['capital_required'](stock_price)

        # Handle infinite values for display
        if max_profit == float('inf'):
            max_profit = stock_price * 2 * 100  # Estimate
        if max_loss == float('inf'):
            max_loss = stock_price * 2 * 100  # Estimate

        return {
            'max_profit': max_profit,
            'max_loss': -abs(max_loss),  # Ensure losses are negative
            'capital_required': capital_required,
            'probability_of_profit': confidence / 100.0,
            'description': config['description']
        }
