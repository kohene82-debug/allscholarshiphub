"""
Standalone Scholarship Scraper (BeautifulSoup version)
Can be run independently without Scrapy for simple use cases
"""
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, date
import os
import re
import json
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()


class ScholarshipScraper:
    """
    Standalone scholarship scraper using BeautifulSoup
    Designed for GitHub Actions automation
    """
    
    def __init__(self):
        self.db_connection = None
        self.db_cursor = None
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        })
        self.stats = {
            'inserted': 0,
            'duplicates': 0,
            'errors': 0,
            'sources_processed': 0
        }
        
        # Scholarship sources configuration
        self.sources = {
            'scholarship_positions': {
                'url': 'https://scholarship-positions.com/',
                'parser': self.parse_scholarship_positions,
            },
            'opportunities_corners': {
                'url': 'https://opportunitiescorners.com/',
                'parser': self.parse_opportunities_corners,
            },
            'scholarship_roar': {
                'url': 'https://scholarshiproar.com/',
                'parser': self.parse_scholarship_roar,
            }
        }
    
    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            self.db_connection = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                port=os.getenv('DB_PORT', '5432'),
                database=os.getenv('DB_NAME', 'scholarships'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'password')
            )
            self.db_cursor = self.db_connection.cursor()
            logger.info("Database connected successfully")
            return True
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            return False
    
    def close_db(self):
        """Close database connection"""
        if self.db_cursor:
            self.db_cursor.close()
        if self.db_connection:
            self.db_connection.close()
        logger.info("Database connection closed")
    
    def run(self):
        """Main execution method"""
        logger.info("Starting scholarship scraper...")
        
        if not self.connect_db():
            return False
        
        try:
            for source_name, source_config in self.sources.items():
                logger.info(f"Processing source: {source_name}")
                try:
                    scholarships = source_config['parser'](source_config['url'])
                    self.insert_scholarships(scholarships, source_name)
                    self.stats['sources_processed'] += 1
                except Exception as e:
                    logger.error(f"Error processing {source_name}: {e}")
                    self.stats['errors'] += 1
            
            self.log_run()
            logger.info(
                f"Scraper completed: {self.stats['inserted']} inserted, "
                f"{self.stats['duplicates']} duplicates, {self.stats['errors']} errors"
            )
            return True
            
        finally:
            self.close_db()
    
    def fetch_page(self, url):
        """Fetch and parse a webpage"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'lxml')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def parse_scholarship_positions(self, url):
        """Parse scholarship-positions.com"""
        scholarships = []
        soup = self.fetch_page(url)
        if not soup:
            return scholarships
        
        articles = soup.find_all('article', class_='post')[:20]
        
        for article in articles:
            try:
                title_elem = article.find('h2', class_='entry-title')
                if not title_elem:
                    continue
                
                name = title_elem.get_text().strip()
                link_elem = title_elem.find('a')
                app_link = link_elem['href'] if link_elem else ''
                
                # Extract details from article
                content = article.find('div', class_='entry-content')
                description = content.get_text().strip()[:500] if content else ''
                
                # Try to extract deadline
                deadline = self.extract_deadline(description)
                
                # Try to extract amount
                amount = self.extract_amount(description)
                
                scholarships.append({
                    'name': name,
                    'description': description,
                    'provider': '',
                    'eligibility': '',
                    'amount': amount,
                    'currency': 'USD',
                    'deadline': deadline,
                    'application_link': app_link,
                    'country': 'International',
                    'degree_level': self.detect_degree_level(name + description),
                    'subject': self.detect_subject(name + description),
                    'source_url': url,
                    'source_name': 'scholarship-positions.com'
                })
            except Exception as e:
                logger.error(f"Error parsing article: {e}")
        
        return scholarships
    
    def parse_opportunities_corners(self, url):
        """Parse opportunitiescorners.com"""
        scholarships = []
        soup = self.fetch_page(url)
        if not soup:
            return scholarships
        
        posts = soup.find_all('article', class_='type-post')[:20]
        
        for post in posts:
            try:
                title_elem = post.find('h2', class_='entry-title')
                if not title_elem:
                    continue
                
                name = title_elem.get_text().strip()
                link = title_elem.find('a')['href'] if title_elem.find('a') else ''
                
                excerpt = post.find('div', class_='entry-excerpt')
                description = excerpt.get_text().strip()[:500] if excerpt else ''
                
                deadline = self.extract_deadline(description)
                amount = self.extract_amount(description)
                
                scholarships.append({
                    'name': name,
                    'description': description,
                    'provider': '',
                    'eligibility': '',
                    'amount': amount,
                    'currency': 'USD',
                    'deadline': deadline,
                    'application_link': link,
                    'country': 'International',
                    'degree_level': self.detect_degree_level(name + description),
                    'subject': self.detect_subject(name + description),
                    'source_url': url,
                    'source_name': 'opportunitiescorners.com'
                })
            except Exception as e:
                logger.error(f"Error parsing post: {e}")
        
        return scholarships
    
    def parse_scholarship_roar(self, url):
        """Parse scholarshiproar.com"""
        scholarships = []
        soup = self.fetch_page(url)
        if not soup:
            return scholarships
        
        articles = soup.find_all('article')[:20]
        
        for article in articles:
            try:
                title = article.find('h2')
                if not title:
                    continue
                
                name = title.get_text().strip()
                link = title.find('a')['href'] if title.find('a') else ''
                
                content = article.find('div', class_='entry-content')
                description = content.get_text().strip()[:500] if content else ''
                
                deadline = self.extract_deadline(description)
                amount = self.extract_amount(description)
                
                scholarships.append({
                    'name': name,
                    'description': description,
                    'provider': '',
                    'eligibility': '',
                    'amount': amount,
                    'currency': 'USD',
                    'deadline': deadline,
                    'application_link': link,
                    'country': 'International',
                    'degree_level': self.detect_degree_level(name + description),
                    'subject': self.detect_subject(name + description),
                    'source_url': url,
                    'source_name': 'scholarshiproar.com'
                })
            except Exception as e:
                logger.error(f"Error parsing article: {e}")
        
        return scholarships
    
    def extract_deadline(self, text):
        """Extract deadline date from text"""
        if not text:
            return None
        
        # Common date patterns
        patterns = [
            r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})',
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})',
            r'(\d{4})-(\d{2})-(\d{2})',
            r'(\d{1,2})/(\d{1,2})/(\d{4})',
            r'Deadline:\s*(.+?)(?:\n|$)',
            r'Closing\s*Date:\s*(.+?)(?:\n|$)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    date_str = match.group(0)
                    # Try to parse the date
                    return self.parse_date(date_str)
                except:
                    continue
        
        return None
    
    def parse_date(self, date_str):
        """Parse various date formats"""
        formats = [
            '%d %B %Y',
            '%B %d %Y',
            '%B %d, %Y',
            '%Y-%m-%d',
            '%d/%m/%Y',
            '%m/%d/%Y',
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str.strip(), fmt).date()
            except:
                continue
        
        return None
    
    def extract_amount(self, text):
        """Extract scholarship amount from text"""
        if not text:
            return ''
        
        patterns = [
            r'\$[\d,]+(?:\.\d{2})?',
            r'€[\d,]+(?:\.\d{2})?',
            r'£[\d,]+(?:\.\d{2})?',
            r'full\s+tuition',
            r'full\s+funding',
            r'fully\s+funded',
            r'partial\s+funding',
            r'\d+%\s+tuition',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        
        return ''
    
    def detect_degree_level(self, text):
        """Detect degree level from text"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['phd', 'doctorate', 'doctoral', 'ph.d']):
            return 'PhD'
        elif any(word in text_lower for word in ['master', 'masters', 'mba', 'msc', 'ma']):
            return 'Master'
        elif any(word in text_lower for word in ['bachelor', 'bachelors', 'undergraduate', 'bs', 'ba']):
            return 'Bachelor'
        elif any(word in text_lower for word in ['high school', 'secondary']):
            return 'High School'
        
        return 'Any'
    
    def detect_subject(self, text):
        """Detect subject/field from text"""
        subjects = {
            'Engineering': ['engineering', 'computer science', 'software', 'mechanical', 'electrical'],
            'Medicine': ['medicine', 'medical', 'health', 'nursing', 'pharmacy'],
            'Business': ['business', 'mba', 'management', 'finance', 'economics'],
            'Science': ['science', 'physics', 'chemistry', 'biology', 'mathematics'],
            'Arts': ['arts', 'humanities', 'literature', 'history', 'philosophy'],
            'Law': ['law', 'legal', 'llm', 'jurisprudence'],
        }
        
        text_lower = text.lower()
        
        for subject, keywords in subjects.items():
            if any(kw in text_lower for kw in keywords):
                return subject
        
        return 'Any'
    
    def insert_scholarships(self, scholarships, source_name):
        """Insert scholarships into database with duplicate prevention"""
        if not scholarships:
            logger.info(f"No scholarships found for {source_name}")
            return
        
        try:
            query = """
                INSERT INTO scholarships 
                (name, description, provider, eligibility, amount, currency, 
                 deadline, application_link, country, degree_level, subject, 
                 source_url, source_name, updated_at)
                VALUES %s
                ON CONFLICT (name, provider, deadline) 
                DO UPDATE SET
                    description = EXCLUDED.description,
                    eligibility = EXCLUDED.eligibility,
                    amount = EXCLUDED.amount,
                    application_link = EXCLUDED.application_link,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING (xmax = 0) as inserted
            """
            
            values = []
            for s in scholarships:
                values.append((
                    s['name'][:500],
                    s['description'][:5000],
                    s['provider'][:255],
                    s['eligibility'][:2000],
                    s['amount'][:255],
                    s['currency'][:10],
                    s['deadline'],
                    s['application_link'],
                    s['country'][:100],
                    s['degree_level'][:100],
                    s['subject'][:200],
                    s['source_url'],
                    s['source_name'][:100]
                ))
            
            execute_values(self.db_cursor, query, values, fetch=True)
            results = self.db_cursor.fetchall()
            
            for result in results:
                if result[0]:
                    self.stats['inserted'] += 1
                else:
                    self.stats['duplicates'] += 1
            
            self.db_connection.commit()
            logger.info(f"Inserted {len(scholarships)} scholarships from {source_name}")
            
        except Exception as e:
            self.db_connection.rollback()
            logger.error(f"Error inserting scholarships: {e}")
            self.stats['errors'] += len(scholarships)
    
    def log_run(self):
        """Log scraper execution"""
        try:
            query = """
                INSERT INTO scraper_logs 
                (source_name, items_scraped, items_inserted, items_duplicates, 
                 started_at, completed_at, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            self.db_cursor.execute(query, (
                'standalone_scraper',
                self.stats['inserted'] + self.stats['duplicates'],
                self.stats['inserted'],
                self.stats['duplicates'],
                datetime.now(),
                datetime.now(),
                'completed' if self.stats['errors'] == 0 else 'partial'
            ))
            self.db_connection.commit()
        except Exception as e:
            logger.error(f"Error logging run: {e}")


def main():
    """Entry point for GitHub Actions"""
    scraper = ScholarshipScraper()
    success = scraper.run()
    
    # Output results for GitHub Actions
    result = {
        'success': success,
        'stats': scraper.stats,
        'timestamp': datetime.now().isoformat()
    }
    
    print(json.dumps(result, indent=2, default=str))
    
    return 0 if success else 1


if __name__ == '__main__':
    exit(main())
