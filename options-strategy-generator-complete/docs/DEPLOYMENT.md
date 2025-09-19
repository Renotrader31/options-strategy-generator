# 🚀 Deployment Guide

## Quick Deployment to Vercel (5 minutes)

### Step 1: Prepare Repository
1. **Create GitHub repository:**
   ```bash
   # Create new repo on GitHub, then:
   git clone https://github.com/yourusername/options-strategy-generator.git
   cd options-strategy-generator

   # Copy all generated files to this directory
   # Commit and push
   git add .
   git commit -m "Initial commit: Options Strategy Generator"
   git push origin main
   ```

### Step 2: Deploy to Vercel
1. **Visit [vercel.com](https://vercel.com) and sign up/login**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Environment Variables
In Vercel dashboard, add these environment variables:
```
POLYGON_API_KEY=75rlu6cWGNnIqqR_x8M384YUjBgGk6kT
NODE_ENV=production
NEXTAUTH_SECRET=your-production-secret-key-here
```

### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live at `https://your-app-name.vercel.app`

## Advanced Deployment Options

### Custom Domain
1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel dashboard:**
   - Go to project settings
   - Click "Domains"
   - Add your domain
   - Update DNS settings as shown

### API Routes
The backend API automatically deploys as Vercel serverless functions:
- `/api/scan` - Strategy analysis
- `/api/quote/{ticker}` - Stock quotes
- `/docs` - API documentation

### Performance Optimization
- **Edge caching** enabled automatically
- **Image optimization** built-in
- **Global CDN** for fast loading worldwide

## Monitoring & Analytics

### Built-in Vercel Analytics
- Real-time visitor data
- Performance metrics
- Error tracking
- Geographic distribution

### Custom Analytics (Optional)
Add to `frontend/src/pages/_app.tsx`:
```javascript
// Google Analytics
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Add your analytics code here
  }, []);

  return <Component {...pageProps} />;
}
```

## Troubleshooting

### Common Issues

1. **Build Errors:**
   ```bash
   # Check dependencies
   cd frontend && npm install
   cd ../api && pip install -r requirements.txt

   # Verify build locally
   npm run build
   ```

2. **API Not Working:**
   - Verify `POLYGON_API_KEY` is set in Vercel
   - Check function logs in Vercel dashboard
   - Test API locally: `cd api && python main.py`

3. **Environment Variables:**
   - Must be set in Vercel dashboard
   - Redeploy after adding new variables
   - Use preview deployments to test

### Getting Help
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Issues:** Create issue in your repository
- **Discord Community:** Vercel & Next.js communities

## Security Best Practices

### Production Configuration
1. **Update CORS settings** in `api/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Specific domain
       allow_credentials=True,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],
   )
   ```

2. **Rate limiting** (already configured):
   - 100 requests/minute per IP
   - Automatic scaling with Vercel

3. **Environment variables:**
   - Never commit `.env` files
   - Use Vercel dashboard for secrets
   - Rotate API keys regularly

## Scaling & Performance

### Automatic Scaling
- **Serverless functions** scale automatically
- **Global edge network** for fast loading
- **No server management** required

### Cost Optimization
- **Vercel Free Tier:**
  - 100GB bandwidth/month
  - 100 serverless function invocations/day
  - Custom domains included

- **Pro Tier ($20/month):**
  - 1TB bandwidth
  - Unlimited functions
  - Advanced analytics
  - Team collaboration

### Performance Monitoring
```bash
# Check deployment status
vercel --version

# View logs
vercel logs your-deployment-url

# Performance insights
vercel inspect your-deployment-url
```

## Maintenance

### Updates
```bash
# Update dependencies
cd frontend && npm update
cd ../api && pip install -r requirements.txt --upgrade

# Deploy updates
git add .
git commit -m "Update dependencies"
git push origin main  # Auto-deploys to Vercel
```

### Monitoring
- **Uptime monitoring:** Built into Vercel
- **Error tracking:** View in dashboard
- **Performance metrics:** Real-time analytics

---

Your Options Strategy Generator is now live and ready for users! 🎉
