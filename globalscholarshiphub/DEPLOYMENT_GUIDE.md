# All Scholarships Hub - Deployment & Hosting Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Domain Setup](#domain-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Scraper Automation](#scraper-automation)
7. [Environment Variables](#environment-variables)
8. [Publishing Checklist](#publishing-checklist)

---

## Overview

This guide covers the complete deployment process for the All Scholarships Hub platform, including:
- Frontend hosting on Vercel/Netlify
- PostgreSQL database setup
- Automated web scraper configuration
- Domain configuration
- SSL/HTTPS setup

---

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account
- [ ] Domain name (recommended: Namecheap, Cloudflare, or GoDaddy)
- [ ] Vercel or Netlify account
- [ ] PostgreSQL database (Supabase, Railway, or Render)
- [ ] Basic knowledge of Git and command line

---

## Domain Setup

### 1. Register Domain

**Recommended Registrars:**
| Provider | Price (approx) | Features |
|----------|---------------|----------|
| Namecheap | $12/year | Free WHOIS privacy, good support |
| Cloudflare | At cost | Free CDN, security features |
| GoDaddy | $15/year | Popular, frequent promotions |
| Google Domains | $12/year | Clean interface, reliable |

**Steps:**
1. Search for "allscholarshipshub.com" or your preferred domain
2. Complete the purchase
3. Note your domain's nameservers

### 2. Configure DNS

For **Vercel** deployment:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

For **Netlify** deployment:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

**Step 2: Deploy**
```bash
cd frontend
vercel --prod
```

**Step 3: Configure Custom Domain**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add "allscholarshipshub.com"
3. Follow DNS configuration instructions

**GitHub Integration (Auto-deploy):**
1. Connect GitHub repo to Vercel
2. Every push to `main` branch auto-deploys
3. Preview deployments for pull requests

### Option 2: Netlify

**Step 1: Install Netlify CLI**
```bash
npm i -g netlify-cli
```

**Step 2: Deploy**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

**Step 3: Configure Custom Domain**
1. Go to Netlify Dashboard → Site Settings → Domain Management
2. Add custom domain
3. Configure DNS as shown above

---

## Database Setup

### Option 1: Supabase (Recommended - Free Tier)

**Step 1: Create Account**
1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project

**Step 2: Get Connection Details**
```
Project Settings → Database → Connection String
```

**Step 3: Run Schema**
1. Go to SQL Editor
2. Copy contents of `database/schema.sql`
3. Run the SQL

**Step 4: Get API Keys**
```
Project Settings → API
- URL: https://your-project.supabase.co
- anon/public key: eyJ...
```

### Option 2: Railway

**Step 1: Create Account**
1. Go to https://railway.app
2. Sign up with GitHub

**Step 2: Add PostgreSQL**
1. New Project → Add PostgreSQL
2. Copy connection details from Variables tab

### Option 3: Render

**Step 1: Create Account**
1. Go to https://render.com
2. Sign up

**Step 2: Create PostgreSQL Instance**
1. New → PostgreSQL
2. Choose plan (Free or Starter $7/month)
3. Copy internal connection string

---

## Scraper Automation

### GitHub Actions Setup

**Step 1: Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/allscholarshipshub.git
git push -u origin main
```

**Step 2: Add Secrets**
Go to GitHub → Settings → Secrets and Variables → Actions

Add these secrets:
```
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=scholarships
DB_USER=postgres
DB_PASSWORD=your-password
VERCEL_DEPLOY_HOOK=your-vercel-hook-url (optional)
```

**Step 3: Verify Workflow**
1. Go to Actions tab
2. Check "Daily Scholarship Scraper" workflow
3. Run manually to test: Actions → Daily Scholarship Scraper → Run workflow

### Cron Schedule

The scraper runs daily at 00:00 UTC (midnight):
```yaml
schedule:
  - cron: '0 0 * * *'
```

To change schedule:
| Schedule | Cron Expression |
|----------|----------------|
| Every hour | `0 * * * *` |
| Every 6 hours | `0 */6 * * *` |
| Twice daily | `0 */12 * * *` |
| Weekly (Sunday) | `0 0 * * 0` |

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-api-url.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Scraper (.env)
```
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=scholarships
DB_USER=postgres
DB_PASSWORD=your-password
```

### Local Development
Create `.env` file in:
- `/frontend/.env` - Frontend variables
- `/scraper/.env` - Scraper variables

---

## Publishing Checklist

### Pre-launch
- [ ] Domain registered and DNS configured
- [ ] SSL certificate active (HTTPS)
- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] GitHub Actions secrets configured
- [ ] Test scraper runs successfully
- [ ] Frontend builds without errors
- [ ] All pages loading correctly
- [ ] Contact form working
- [ ] Multi-language switching works
- [ ] Mobile responsiveness verified

### Content
- [ ] Sample scholarships added
- [ ] Featured scholarships selected
- [ ] Contact information correct
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] About page content ready

### SEO & Analytics
- [ ] Google Analytics 4 setup
- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] robots.txt created
- [ ] Favicon added
- [ ] Open Graph tags for social sharing

### Post-launch
- [ ] Submit to Google Search Console
- [ ] Test all contact methods
- [ ] Verify daily scraper runs
- [ ] Monitor error logs
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create social media accounts
- [ ] Announce launch

---

## Cost Breakdown

### Free Tier Setup
| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Domain | Namecheap | ~$1/year |
| Frontend | Vercel/Netlify | Free |
| Database | Supabase | Free (500MB) |
| Scraper | GitHub Actions | Free (2000 min) |
| CDN | Cloudflare | Free |
| **Total** | | **~$1/month** |

### Paid Setup (Recommended for Production)
| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Domain | Namecheap | ~$1/year |
| Frontend | Vercel Pro | $20 |
| Database | Supabase Pro | $25 |
| Scraper | GitHub Actions | Free |
| CDN | Cloudflare Pro | $20 |
| Monitoring | UptimeRobot | Free |
| **Total** | | **~$65/month** |

---

## Troubleshooting

### Common Issues

**1. Build Fails on Vercel**
```
Solution: Check build command in vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**2. Database Connection Error**
```
Solution: Verify IP whitelist in database settings
Add 0.0.0.0/0 temporarily for testing
```

**3. Scraper Not Running**
```
Solution: Check GitHub Actions logs
Verify secrets are set correctly
```

**4. CORS Errors**
```
Solution: Add CORS headers in API/edge functions
Or configure in Vercel/Netlify settings
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **React i18next**: https://react.i18next.com

---

## Next Steps After Deployment

1. **Add More Scholarship Sources**
   - Configure additional spiders
   - Add more target websites

2. **Implement User Accounts**
   - Add authentication
   - Save favorite scholarships
   - Email alerts

3. **Enhance Search**
   - Add Elasticsearch
   - Implement faceted search
   - Add search suggestions

4. **Mobile App**
   - Build React Native app
   - Share codebase with web

5. **API Development**
   - Build REST API
   - Add rate limiting
   - Create API documentation
