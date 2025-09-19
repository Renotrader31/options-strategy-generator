#!/usr/bin/env python3
"""
Vercel-compatible entry point for Options Strategy Generator API
This file serves as the main handler for all API routes in Vercel's serverless environment
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import asyncio
import logging
from datetime import datetime, timedelta
import json
import sys

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

# Import our existing strategy modules
try:
    from strategies.options_engine import OptionsStrategyEngine
    from data.polygon_client import PolygonClient
except ImportError as e:
    logging.error(f"Import error: {e}")
    # Fallback imports or error handling

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Options Strategy Generator API",
    description="Professional options strategy analysis and recommendation system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
POLYGON_API_KEY = os.getenv("POLYGON_API_KEY", "75rlu6cWGNnIqqR_x8M384YUjBgGk6kT")

# Global variables for services (initialized on first request)
polygon_client = None
strategy_engine = None

def init_services():
    """Initialize services on first request"""
    global polygon_client, strategy_engine
    if polygon_client is None:
        polygon_client = PolygonClient(api_key=POLYGON_API_KEY)
        strategy_engine = OptionsStrategyEngine(polygon_client)

# Pydantic models for request/response
class ScanRequest(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10, description="Stock ticker symbol")
    risk_profile: str = Field(default="moderate_aggressive", description="Risk tolerance level")
    min_dte: int = Field(default=30, ge=1, le=365, description="Minimum days to expiration")
    max_dte: int = Field(default=45, ge=1, le=365, description="Maximum days to expiration")
    max_strategies: int = Field(default=10, ge=1, le=20, description="Maximum number of strategies to return")
    max_capital: Optional[int] = Field(default=None, description="Maximum capital per trade")

class ScanResponse(BaseModel):
    success: bool
    strategies: List[Dict[str, Any]]
    current_price: Optional[float] = Field(default=None, alias="currentPrice")
    ticker: str
    error: Optional[str] = None
    timestamp: str

# Health check endpoint
@app.get("/")
@app.get("/api")
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Options Strategy Generator API",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Main strategy scanning endpoint
@app.post("/api/scan")
async def scan_strategies(request: ScanRequest):
    """
    Scan and rank options strategies for a given ticker
    """
    try:
        init_services()
        logger.info(f"Scanning strategies for {request.ticker}")

        # Validate ticker
        ticker = request.ticker.upper().strip()
        if not ticker:
            raise HTTPException(status_code=400, detail="Ticker is required")

        # Get current stock price
        stock_data = await polygon_client.get_stock_price(ticker)
        if not stock_data:
            raise HTTPException(status_code=404, detail=f"Stock data not found for {ticker}")

        current_price = stock_data.get('price', 0)

        # Generate strategies
        strategies = await strategy_engine.scan_strategies(
            ticker=ticker,
            risk_profile=request.risk_profile,
            min_dte=request.min_dte,
            max_dte=request.max_dte,
            max_strategies=request.max_strategies
        )

        if not strategies:
            return {
                "success": False,
                "strategies": [],
                "currentPrice": current_price,
                "ticker": ticker,
                "error": "No viable strategies found",
                "timestamp": datetime.now().isoformat()
            }

        # Format strategies for response
        formatted_strategies = []
        for strategy in strategies:
            formatted_strategies.append({
                "id": strategy.get("id", ""),
                "name": strategy.get("name", ""),
                "type": strategy.get("type", ""),
                "complexity": strategy.get("complexity", ""),
                "confidence": strategy.get("confidence_score", 0),
                "maxProfit": strategy.get("max_profit", 0),
                "maxLoss": strategy.get("max_loss", 0),
                "capitalRequired": strategy.get("capital_required", 0),
                "probabilityOfProfit": strategy.get("probability_of_profit"),
                "description": strategy.get("description", ""),
                "currentPrice": current_price,
                "ticker": ticker
            })

        return {
            "success": True,
            "strategies": formatted_strategies,
            "currentPrice": current_price,
            "ticker": ticker,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scanning strategies: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Get stock quote endpoint
@app.get("/api/quote/{ticker}")
async def get_stock_quote(ticker: str):
    """Get current stock quote"""
    try:
        init_services()
        ticker = ticker.upper().strip()
        stock_data = await polygon_client.get_stock_price(ticker)

        if not stock_data:
            raise HTTPException(status_code=404, detail=f"Stock data not found for {ticker}")

        return {
            "success": True,
            "data": stock_data,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting quote: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Strategy details endpoint
@app.get("/api/strategy/{strategy_id}")
async def get_strategy_details(strategy_id: str):
    """Get detailed information about a specific strategy"""
    try:
        return {
            "success": True,
            "strategy": {
                "id": strategy_id,
                "name": "Sample Strategy",
                "description": "Detailed strategy information would go here"
            },
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Error getting strategy details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Export strategies endpoint
@app.post("/api/export")
async def export_strategies(strategies: List[Dict[str, Any]]):
    """Export strategies to various formats"""
    try:
        export_data = {
            "strategies": strategies,
            "generated_at": datetime.now().isoformat(),
            "total_count": len(strategies)
        }

        return JSONResponse(
            content=export_data,
            headers={
                "Content-Disposition": "attachment; filename=strategies.json"
            }
        )

    except Exception as e:
        logger.error(f"Error exporting strategies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "error": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )

# Vercel handler - this is the main entry point
def handler(request, context=None):
    """Vercel serverless function handler"""
    return app

# Export for Vercel
app_handler = app