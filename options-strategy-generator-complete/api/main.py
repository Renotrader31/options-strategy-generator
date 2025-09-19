#!/usr/bin/env python3
"""
Vercel-compatible FastAPI endpoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Options Strategy Generator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
async def health():
    return {"status": "healthy", "message": "Options Strategy Generator API"}

@app.get("/api")
@app.get("/api/health")  
async def api_health():
    return {"status": "healthy", "message": "API is running"}

@app.post("/api/scan")
async def scan_strategies(data: dict):
    # Mock response for now
    return {
        "success": True,
        "ticker": data.get("ticker", "AAPL"),
        "strategies": [
            {
                "name": "Bull Put Spread",
                "confidence": 75.2,
                "maxProfit": 850,
                "maxLoss": -150,
                "type": "bullish"
            }
        ],
        "currentPrice": 175.50
    }

@app.get("/api/quote/{ticker}")
async def get_quote(ticker: str):
    return {
        "success": True,
        "ticker": ticker,
        "price": 175.50,
        "change": 2.30
    }