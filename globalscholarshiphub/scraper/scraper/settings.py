"""
Scrapy settings for Scholarship Scraper
"""
import os
from dotenv import load_dotenv

load_dotenv()

BOT_NAME = 'scholarship_scraper'

SPIDER_MODULES = ['scraper.spiders']
NEWSPIDER_MODULE = 'scraper.spiders'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure delays
DOWNLOAD_DELAY = 2  # 2 seconds between requests
RANDOMIZE_DOWNLOAD_DELAY = True

# Concurrent requests
CONCURRENT_REQUESTS = 4
CONCURRENT_REQUESTS_PER_DOMAIN = 2

# AutoThrottle settings
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1
AUTOTHROTTLE_MAX_DELAY = 10
AUTOTHROTTLE_TARGET_CONCURRENCY = 2.0

# Retry settings
RETRY_ENABLED = True
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429]

# User agent rotation
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

# Pipeline configuration
ITEM_PIPELINES = {
    'scraper.pipelines.ValidationPipeline': 100,
    'scraper.pipelines.ScholarshipPipeline': 200,
}

# Logging
LOG_LEVEL = 'INFO'
LOG_FORMAT = '%(levelname)s: %(message)s'

# Feed exports (for backup)
FEEDS = {
    'scholarships_%(time)s.json': {
        'format': 'json',
        'encoding': 'utf8',
        'store_empty': False,
        'overwrite': True
    }
}

# Request headers
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
}

# Cache
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400  # 24 hours
HTTPCACHE_DIR = 'httpcache'

# Database settings (loaded from environment)
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'scholarships')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
