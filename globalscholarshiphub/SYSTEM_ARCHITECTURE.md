# All Scholarships Hub - System Architecture

## Overview
A comprehensive, automated platform that scans the internet daily for new scholarships worldwide and presents them through a modern, multi-language web interface.

---

## Tech Stack

### 1. Data Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL | Primary data store for scholarships |
| Cache | Redis | Session storage & API response caching |
| Search | Elasticsearch (optional) | Full-text search capabilities |

### 2. Backend Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Web Scraper | Python + Scrapy | Automated scholarship crawling |
| Parser | BeautifulSoup4 | HTML parsing for non-JS sites |
| API | Node.js + Express or Python FastAPI | RESTful API endpoints |
| Scheduler | GitHub Actions / Cron | Daily automation |
| Validation | Pydantic | Data validation |

### 3. Frontend Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 18 + TypeScript | UI development |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Components | shadcn/ui | Pre-built accessible components |
| State | Zustand / React Query | State management |
| i18n | react-i18next | Multi-language support |
| Icons | Lucide React | Icon library |
| Build Tool | Vite | Fast development & production builds |

### 4. Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend Hosting | Vercel / Netlify | Static site deployment |
| Backend/Database | Railway / Render / Supabase | PostgreSQL hosting |
| Scraper Hosting | GitHub Actions | Free scheduled execution |
| CDN | Cloudflare | Global content delivery |
| Domain | Namecheap / Cloudflare | Domain registration |

---

## Database Schema (PostgreSQL)

```sql
-- Scholarships table
CREATE TABLE scholarships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    provider VARCHAR(255),
    eligibility TEXT,
    amount VARCHAR(255),
    currency VARCHAR(10),
    deadline DATE,
    application_link TEXT,
    country VARCHAR(100),
    degree_level VARCHAR(100), -- Bachelor, Master, PhD, etc.
    subject VARCHAR(200),
    status VARCHAR(50) DEFAULT 'active',
    source_url TEXT,
    source_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, provider, deadline)
);

-- Indexes for performance
CREATE INDEX idx_scholarships_country ON scholarships(country);
CREATE INDEX idx_scholarships_degree ON scholarships(degree_level);
CREATE INDEX idx_scholarships_subject ON scholarships(subject);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_status ON scholarships(status);

-- Languages table for i18n
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Translations table
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) REFERENCES languages(code),
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(language_code, key)
);

-- Scraper logs
CREATE TABLE scraper_logs (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100),
    items_scraped INTEGER,
    items_inserted INTEGER,
    items_duplicates INTEGER,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(50),
    error_message TEXT
);
```

---

## API Endpoints

```
GET    /api/scholarships              # List all scholarships (with pagination)
GET    /api/scholarships/:id          # Get single scholarship
GET    /api/scholarships/featured     # Get featured scholarships
GET    /api/scholarships/search?q=    # Search scholarships
GET    /api/scholarships/filter       # Filter by country, degree, subject
GET    /api/countries                 # Get unique countries
GET    /api/degree-levels             # Get unique degree levels
GET    /api/subjects                  # Get unique subjects
GET    /api/translations/:lang        # Get translations for language
POST   /api/contact                   # Submit contact form
```

---

## Folder Structure

```
allscholarshipshub/
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── sections/         # Page sections
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities & API clients
│   │   ├── i18n/             # Translation files
│   │   ├── types/            # TypeScript definitions
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── scraper/                  # Python web scraper
│   ├── scraper/
│   │   ├── spiders/          # Scrapy spiders
│   │   ├── pipelines.py      # Data processing
│   │   ├── items.py          # Data models
│   │   └── settings.py
│   ├── requirements.txt
│   └── scrapy.cfg
├── database/                 # SQL & migrations
│   ├── schema.sql
│   └── migrations/
├── .github/
│   └── workflows/
│       └── daily-scrape.yml  # GitHub Actions
└── docs/                     # Documentation
```

---

## Multi-Language Support

Supported Languages:
- 🇺🇸 English (en) - Default
- 🇫🇷 French (fr)
- 🇵🇹 Portuguese (pt)
- 🇩🇪 German (de)
- 🇸🇦 Arabic (ar) - RTL support
- 🇨🇳 Chinese (zh)

---

## Automation Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Actions │────▶│  Python Scraper │────▶│   PostgreSQL    │
│  (Daily 00:00)  │     │  (Scrapy/BS4)   │     │    Database     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │◀────│  React Frontend │◀────│   REST API      │
│  (Global)       │     │  (Vercel)       │     │  (Node/Python)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Cost Estimation (Monthly)

| Service | Provider | Cost |
|---------|----------|------|
| Domain | Namecheap | ~$12/year |
| Frontend Hosting | Vercel | Free tier |
| Database | Supabase/Railway | Free - $5 |
| Scraper | GitHub Actions | Free (2000 min/month) |
| CDN | Cloudflare | Free tier |
| **Total** | | **~$1-5/month** |

---

## Security Considerations

1. **Rate Limiting**: Prevent API abuse
2. **CORS**: Restrict API access to domain
3. **Input Validation**: Sanitize all user inputs
4. **HTTPS**: Enforce SSL/TLS
5. **Environment Variables**: Store secrets securely
6. **Database**: Use connection pooling & prepared statements
