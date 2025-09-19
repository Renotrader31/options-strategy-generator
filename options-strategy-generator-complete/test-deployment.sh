#!/bin/bash

# Test deployment script for Options Strategy Generator
# Run this after deployment to verify everything works

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get deployment URL (replace with your actual URL)
VERCEL_URL=${1:-"https://your-app.vercel.app"}

echo -e "${YELLOW}🧪 Testing Options Strategy Generator Deployment${NC}"
echo -e "${YELLOW}URL: $VERCEL_URL${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✅ Health Check: PASSED${NC}"
else
    echo -e "   ${RED}❌ Health Check: FAILED (HTTP $HEALTH_RESPONSE)${NC}"
fi

# Test 2: Stock Quote
echo -e "${YELLOW}2. Testing Stock Quote API...${NC}"
QUOTE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/quote/AAPL")
if [ "$QUOTE_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✅ Stock Quote: PASSED${NC}"
else
    echo -e "   ${RED}❌ Stock Quote: FAILED (HTTP $QUOTE_RESPONSE)${NC}"
fi

# Test 3: Strategy Scan
echo -e "${YELLOW}3. Testing Strategy Scan API...${NC}"
SCAN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$VERCEL_URL/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "risk_profile": "moderate_aggressive"}')
if [ "$SCAN_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✅ Strategy Scan: PASSED${NC}"
else
    echo -e "   ${RED}❌ Strategy Scan: FAILED (HTTP $SCAN_RESPONSE)${NC}"
fi

# Test 4: Frontend Load
echo -e "${YELLOW}4. Testing Frontend...${NC}"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✅ Frontend: PASSED${NC}"
else
    echo -e "   ${RED}❌ Frontend: FAILED (HTTP $FRONTEND_RESPONSE)${NC}"
fi

# Test 5: API Docs
echo -e "${YELLOW}5. Testing API Documentation...${NC}"
DOCS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/docs")
if [ "$DOCS_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✅ API Docs: PASSED${NC}"
else
    echo -e "   ${RED}❌ API Docs: FAILED (HTTP $DOCS_RESPONSE)${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Test Summary${NC}"
echo "=========================="

# Count passed tests
passed=0
total=5

# Recheck all endpoints for summary
for endpoint in "/api/health" "/api/quote/AAPL" "/api/docs" "/"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL$endpoint")
    if [ "$response" = "200" ]; then
        ((passed++))
    fi
done

# Check strategy scan separately
scan_check=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$VERCEL_URL/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "risk_profile": "moderate_aggressive"}')
if [ "$scan_check" = "200" ]; then
    ((passed++))
fi

echo -e "Passed: ${GREEN}$passed/$total${NC}"
echo -e "Failed: ${RED}$((total - passed))/$total${NC}"

if [ "$passed" = "$total" ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Deployment successful!${NC}"
    echo ""
    echo -e "${YELLOW}🔗 Your app is live at: $VERCEL_URL${NC}"
    echo -e "${YELLOW}📚 API docs available at: $VERCEL_URL/api/docs${NC}"
else
    echo ""
    echo -e "${RED}⚠️  Some tests failed. Check deployment configuration.${NC}"
    echo -e "${YELLOW}💡 Troubleshooting steps:${NC}"
    echo "   1. Check environment variables are set"
    echo "   2. Verify Vercel build logs"
    echo "   3. Review VERCEL_DEPLOYMENT.md"
fi

echo ""