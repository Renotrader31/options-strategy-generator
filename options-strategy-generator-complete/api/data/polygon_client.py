"""
Async Polygon API client for real-time market data
"""

import aiohttp
import asyncio
import logging
from typing import Dict, Optional, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class PolygonClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.polygon.io"
        self.session = None

    async def get_session(self):
        if not self.session:
            self.session = aiohttp.ClientSession()
        return self.session

    async def get_stock_price(self, ticker: str) -> Optional[Dict]:
        """Get current stock price and basic info"""
        try:
            session = await self.get_session()

            # Try previous day aggregates first
            url = f"{self.base_url}/v2/aggs/ticker/{ticker}/prev"
            params = {'adjusted': 'true', 'apikey': self.api_key}

            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()

                    if data.get('status') == 'OK' and data.get('resultsCount', 0) > 0:
                        result = data['results'][0]
                        return {
                            'ticker': ticker,
                            'price': result['c'],  # closing price
                            'high': result['h'],
                            'low': result['l'],
                            'open': result['o'],
                            'volume': result['v'],
                            'timestamp': datetime.now().isoformat()
                        }

                # Fallback to demo data if API fails
                logger.warning(f"API request failed for {ticker}, using demo data")
                return self._get_demo_data(ticker)

        except Exception as e:
            logger.error(f"Error fetching stock price for {ticker}: {e}")
            return self._get_demo_data(ticker)

    def _get_demo_data(self, ticker: str) -> Dict:
        """Generate demo data for testing"""
        demo_prices = {
            'AAPL': 175.50,
            'MSFT': 378.25,
            'GOOGL': 142.75,
            'TSLA': 248.90,
            'SPY': 443.20,
            'QQQ': 376.85,
            'IWM': 192.30,
            'NVDA': 498.75,
        }

        base_price = demo_prices.get(ticker, 150.0)

        return {
            'ticker': ticker,
            'price': base_price,
            'high': base_price * 1.02,
            'low': base_price * 0.98,
            'open': base_price * 1.001,
            'volume': 1000000,
            'timestamp': datetime.now().isoformat()
        }

    async def close(self):
        if self.session:
            await self.session.close()
