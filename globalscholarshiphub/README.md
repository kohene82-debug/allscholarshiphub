# All Scholarships Hub

A comprehensive, automated platform that scans the internet daily for new scholarships worldwide and presents them through a modern, multi-language web interface.

**Website**: https://allscholarshipshub.com

**Live Demo**: https://drj6k43flap56.ok.kimi.link

---

## Features

### Core Features
- **Automated Scholarship Scraping** - Daily scans of major scholarship directories
- **Multi-Language Support** - English, French, Portuguese, German, Arabic, Chinese
- **Advanced Filtering** - Filter by Country, Degree Level, and Subject
- **Search Functionality** - Full-text search across all scholarships
- **Featured Scholarships** - Hand-picked opportunities from top institutions
- **Contact System** - Direct contact with phone numbers (+233 549 307 901, +86 132 5569 6140)
- **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- **Modern Tech Stack** - React + TypeScript + Tailwind CSS + shadcn/ui
- **Database** - PostgreSQL with optimized schema
- **Web Scraper** - Python with Scrapy and BeautifulSoup
- **Automation** - GitHub Actions for daily scraping
- **Type Safety** - Full TypeScript support
- **i18n** - Complete internationalization with RTL support

---

## Project Structure

```
allscholarshipshub/
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── sections/         # Page sections (Hero, Contact, etc.)
│   │   ├── i18n/             # Translation files (6 languages)
│   │   ├── types/            # TypeScript definitions
│   │   └── App.tsx           # Main application
│   └── dist/                 # Production build
├── scraper/                  # Python web scraper
│   ├── scraper/
│   │   ├── spiders/          # Scrapy spiders
│   │   ├── pipelines.py      # Data processing
│   │   └── items.py          # Data models
│   ├── standalone_scraper.py # BeautifulSoup version
│   └── requirements.txt
├── database/
│   └── schema.sql            # PostgreSQL schema
├── .github/
│   └── workflows/
│       └── daily-scrape.yml  # GitHub Actions automation
├── SYSTEM_ARCHITECTURE.md    # Detailed architecture docs
├── DEPLOYMENT_GUIDE.md       # Step-by-step deployment guide
└── README.md                 # This file
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Scraper Setup
```bash
cd scraper
pip install -r requirements.txt
python standalone_scraper.py
```

### Database Setup
```bash
# Create database
createdb scholarships

# Run schema
psql scholarships < database/schema.sql
```

---

## Deployment

### Frontend (Vercel/Recommended)
```bash
cd frontend
npm run build
vercel --prod
```

### Database (Supabase/Recommended)
1. Create account at https://supabase.com
2. Create new project
3. Run schema.sql in SQL Editor
4. Copy connection details to environment variables

### Automated Scraper (GitHub Actions)
1. Push code to GitHub
2. Add secrets in Settings → Secrets:
   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
3. Scraper runs automatically every 24 hours

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend API | Can be added (Node.js/Express or Python/FastAPI) |
| Database | PostgreSQL |
| Scraper | Python, Scrapy, BeautifulSoup4 |
| Automation | GitHub Actions |
| Hosting | Vercel/Netlify (Frontend), Supabase (Database) |
| i18n | react-i18next |

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

---

## API Endpoints (Future Implementation)

```
GET    /api/scholarships              # List all scholarships
GET    /api/scholarships/:id          # Get single scholarship
GET    /api/scholarships/featured     # Get featured scholarships
GET    /api/scholarships/search?q=    # Search scholarships
GET    /api/countries                 # Get unique countries
GET    /api/degree-levels             # Get unique degree levels
POST   /api/contact                   # Submit contact form
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Support

For questions or support, contact us:
- **Ghana**: +233 549 307 901
- **China**: +86 132 5569 6140
- **Email**: info@allscholarshipshub.com

---

## Roadmap

- [ ] User authentication system
- [ ] Email alerts for new scholarships
- [ ] Advanced search with Elasticsearch
- [ ] Mobile app (React Native)
- [ ] Scholarship application tracker
- [ ] Community forum
- [ ] API for third-party integrations
