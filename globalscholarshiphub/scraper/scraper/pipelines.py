"""
Scrapy Pipelines for Processing Scholarship Data
"""
import os
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
from dotenv import load_dotenv
from .items import ScholarshipItem

load_dotenv()


class ScholarshipPipeline:
    """Pipeline to store scholarships in PostgreSQL with duplicate prevention"""
    
    def __init__(self):
        self.db_connection = None
        self.db_cursor = None
        self.items_buffer = []
        self.buffer_size = 50
        self.stats = {
            'inserted': 0,
            'duplicates': 0,
            'errors': 0
        }
    
    def open_spider(self, spider):
        """Initialize database connection"""
        try:
            self.db_connection = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                port=os.getenv('DB_PORT', '5432'),
                database=os.getenv('DB_NAME', 'scholarships'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'password')
            )
            self.db_cursor = self.db_connection.cursor()
            spider.logger.info("Database connection established")
        except Exception as e:
            spider.logger.error(f"Failed to connect to database: {e}")
            raise
    
    def close_spider(self, spider):
        """Close database connection and flush buffer"""
        # Insert remaining items
        if self.items_buffer:
            self._insert_batch(spider)
        
        # Log scraper run
        self._log_scraper_run(spider)
        
        if self.db_cursor:
            self.db_cursor.close()
        if self.db_connection:
            self.db_connection.close()
        
        spider.logger.info(
            f"Scraper completed: {self.stats['inserted']} inserted, "
            f"{self.stats['duplicates']} duplicates, {self.stats['errors']} errors"
        )
    
    def process_item(self, item, spider):
        """Process each scholarship item"""
        if isinstance(item, ScholarshipItem):
            self.items_buffer.append(dict(item))
            
            if len(self.items_buffer) >= self.buffer_size:
                self._insert_batch(spider)
        
        return item
    
    def _insert_batch(self, spider):
        """Insert buffered items with duplicate checking"""
        if not self.items_buffer:
            return
        
        try:
            # Prepare data for insert with ON CONFLICT handling
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
            for item in self.items_buffer:
                # Parse deadline
                deadline = self._parse_deadline(item.get('deadline'))
                
                values.append((
                    item.get('name', '')[:500],
                    item.get('description', '')[:5000],
                    item.get('provider', '')[:255],
                    item.get('eligibility', '')[:2000],
                    item.get('amount', '')[:255],
                    item.get('currency', 'USD')[:10],
                    deadline,
                    item.get('application_link', ''),
                    item.get('country', 'International')[:100],
                    item.get('degree_level', 'Any')[:100],
                    item.get('subject', 'Any')[:200],
                    item.get('source_url', ''),
                    item.get('source_name', 'unknown')[:100]
                ))
            
            execute_values(self.db_cursor, query, values, fetch=True)
            results = self.db_cursor.fetchall()
            
            # Count inserts vs updates
            for result in results:
                if result[0]:  # xmax = 0 means new insert
                    self.stats['inserted'] += 1
                else:
                    self.stats['duplicates'] += 1
            
            self.db_connection.commit()
            spider.logger.info(
                f"Batch inserted: {len(self.items_buffer)} items"
            )
            
        except Exception as e:
            self.db_connection.rollback()
            spider.logger.error(f"Error inserting batch: {e}")
            self.stats['errors'] += len(self.items_buffer)
        finally:
            self.items_buffer = []
    
    def _parse_deadline(self, deadline_str):
        """Parse various deadline formats"""
        if not deadline_str:
            return None
        
        formats = [
            '%Y-%m-%d',
            '%d %B %Y',
            '%B %d, %Y',
            '%d/%m/%Y',
            '%m/%d/%Y',
            '%Y-%m-%dT%H:%M:%S',
            '%d %b %Y',
            '%b %d, %Y'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(str(deadline_str).strip(), fmt).date()
            except ValueError:
                continue
        
        return None
    
    def _log_scraper_run(self, spider):
        """Log scraper execution to database"""
        try:
            query = """
                INSERT INTO scraper_logs 
                (source_name, items_scraped, items_inserted, items_duplicates, 
                 started_at, completed_at, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            self.db_cursor.execute(query, (
                spider.name,
                self.stats['inserted'] + self.stats['duplicates'],
                self.stats['inserted'],
                self.stats['duplicates'],
                datetime.now(),
                datetime.now(),
                'completed' if self.stats['errors'] == 0 else 'partial'
            ))
            self.db_connection.commit()
        except Exception as e:
            spider.logger.error(f"Error logging scraper run: {e}")


class ValidationPipeline:
    """Pipeline to validate scholarship data"""
    
    def process_item(self, item, spider):
        """Validate item before processing"""
        if isinstance(item, ScholarshipItem):
            # Required fields
            if not item.get('name'):
                spider.logger.warning("Item rejected: missing name")
                raise scrapy.exceptions.DropItem("Missing scholarship name")
            
            # Clean and normalize data
            item['name'] = self._clean_text(item.get('name', ''))
            item['description'] = self._clean_text(item.get('description', ''))
            item['country'] = self._normalize_country(item.get('country', 'International'))
            item['degree_level'] = self._normalize_degree(item.get('degree_level', 'Any'))
            
        return item
    
    def _clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ''
        return ' '.join(text.split()).strip()
    
    def _normalize_country(self, country):
        """Normalize country names"""
        country_map = {
            'us': 'USA',
            'usa': 'USA',
            'united states': 'USA',
            'uk': 'UK',
            'united kingdom': 'UK',
            'gb': 'UK',
            'canada': 'Canada',
            'ca': 'Canada',
            'australia': 'Australia',
            'au': 'Australia',
            'germany': 'Germany',
            'de': 'Germany',
            'france': 'France',
            'fr': 'France',
            'international': 'International',
            'worldwide': 'International',
            'global': 'International'
        }
        return country_map.get(country.lower().strip(), country)
    
    def _normalize_degree(self, degree):
        """Normalize degree levels"""
        degree_map = {
            'bachelor': 'Bachelor',
            'bachelors': 'Bachelor',
            'undergraduate': 'Bachelor',
            'undergrad': 'Bachelor',
            'master': 'Master',
            'masters': 'Master',
            'graduate': 'Master',
            'postgraduate': 'Master',
            'phd': 'PhD',
            'doctorate': 'PhD',
            'doctoral': 'PhD',
            'any': 'Any',
            'all': 'Any'
        }
        return degree_map.get(degree.lower().strip(), degree)
