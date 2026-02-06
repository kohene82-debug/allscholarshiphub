"""
Main Scholarship Spider - Crawls multiple scholarship sources
"""
import scrapy
from scrapy.http import Request
from bs4 import BeautifulSoup
from datetime import datetime
import re
from ..items import ScholarshipItem


class ScholarshipSpider(scrapy.Spider):
    """
    Multi-source scholarship spider
    Crawls various scholarship directories and aggregates results
    """
    name = 'scholarship_spider'
    
    custom_settings = {
        'DOWNLOAD_DELAY': 3,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
    }
    
    # Source URLs to crawl
    start_urls = [
        # Major scholarship directories (examples)
        'https://www.scholarships.com/financial-aid/college-scholarships/',
        'https://www.fastweb.com/college-scholarships',
        'https://www.internationalscholarships.com/',
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.sources = {
            'scholarships.com': self.parse_scholarships_com,
            'fastweb.com': self.parse_fastweb,
            'internationalscholarships.com': self.parse_international,
        }
    
    def start_requests(self):
        """Start requests with custom headers"""
        for url in self.start_urls:
            yield Request(
                url=url,
                callback=self.parse,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                meta={'source': url}
            )
    
    def parse(self, response):
        """Route to appropriate parser based on domain"""
        domain = response.url.split('/')[2].replace('www.', '')
        
        if domain in self.sources:
            yield from self.sources[domain](response)
        else:
            # Generic parser for unknown sources
            yield from self.parse_generic(response)
    
    def parse_scholarships_com(self, response):
        """Parse scholarships.com format"""
        scholarships = response.css('div.scholarship-item, .scholarship-listing')
        
        for scholarship in scholarships:
            item = ScholarshipItem()
            item['name'] = self._extract_text(scholarship, 'h2, .scholarship-title, .title')
            item['provider'] = self._extract_text(scholarship, '.provider, .sponsor, .organization')
            item['amount'] = self._extract_text(scholarship, '.amount, .award, .value')
            item['deadline'] = self._extract_text(scholarship, '.deadline, .date')
            item['description'] = self._extract_text(scholarship, '.description, .summary, p')
            item['eligibility'] = self._extract_text(scholarship, '.eligibility, .requirements')
            item['application_link'] = self._extract_link(scholarship, 'a.apply, a.details, a::attr(href)')
            item['country'] = self._extract_text(scholarship, '.location, .country') or 'International'
            item['degree_level'] = self._extract_text(scholarship, '.degree, .level') or 'Any'
            item['subject'] = self._extract_text(scholarship, '.subject, .field, .major') or 'Any'
            item['source_url'] = response.url
            item['source_name'] = 'scholarships.com'
            
            if item['name']:
                yield item
        
        # Follow pagination
        next_page = response.css('a.next::attr(href), .pagination a:last-child::attr(href)').get()
        if next_page:
            yield response.follow(next_page, callback=self.parse_scholarships_com)
    
    def parse_fastweb(self, response):
        """Parse fastweb.com format"""
        scholarships = response.css('.scholarship-card, .result-item')
        
        for scholarship in scholarships:
            item = ScholarshipItem()
            item['name'] = self._extract_text(scholarship, 'h3, .scholarship-name')
            item['provider'] = self._extract_text(scholarship, '.provider-name')
            item['amount'] = self._extract_text(scholarship, '.award-amount')
            item['deadline'] = self._extract_text(scholarship, '.deadline-date')
            item['description'] = self._extract_text(scholarship, '.description')
            item['eligibility'] = self._extract_text(scholarship, '.eligibility-criteria')
            item['application_link'] = response.urljoin(
                scholarship.css('a::attr(href)').get('')
            )
            item['country'] = 'USA'  # Fastweb is US-focused
            item['degree_level'] = self._extract_text(scholarship, '.education-level') or 'Any'
            item['subject'] = 'Any'
            item['source_url'] = response.url
            item['source_name'] = 'fastweb.com'
            
            if item['name']:
                yield item
    
    def parse_international(self, response):
        """Parse internationalscholarships.com format"""
        scholarships = response.css('.scholarship-entry, article')
        
        for scholarship in scholarships:
            item = ScholarshipItem()
            item['name'] = self._extract_text(scholarship, 'h2, h3, .entry-title')
            item['provider'] = self._extract_text(scholarship, '.institution, .university')
            item['amount'] = self._extract_text(scholarship, '.funding, .award')
            item['deadline'] = self._extract_text(scholarship, '.deadline, .closing-date')
            item['description'] = self._extract_text(scholarship, '.excerpt, .content')
            item['eligibility'] = self._extract_text(scholarship, '.requirements, .criteria')
            item['application_link'] = self._extract_link(scholarship, 'a.more, a.apply')
            item['country'] = self._extract_text(scholarship, '.country, .destination') or 'International'
            item['degree_level'] = self._extract_text(scholarship, '.study-level') or 'Any'
            item['subject'] = self._extract_text(scholarship, '.subject-area') or 'Any'
            item['source_url'] = response.url
            item['source_name'] = 'internationalscholarships.com'
            
            if item['name']:
                yield item
    
    def parse_generic(self, response):
        """Generic parser for unknown scholarship sites"""
        soup = BeautifulSoup(response.text, 'lxml')
        
        # Look for common scholarship patterns
        selectors = [
            'article', '.scholarship', '.scholarship-item',
            '[class*="scholarship"]', '[class*="award"]'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                for elem in elements[:10]:  # Limit to first 10
                    item = ScholarshipItem()
                    item['name'] = self._extract_from_soup(elem, ['h2', 'h3', '.title'])
                    item['provider'] = self._extract_from_soup(elem, ['.provider', '.sponsor'])
                    item['amount'] = self._extract_from_soup(elem, ['.amount', '.award'])
                    item['deadline'] = self._extract_from_soup(elem, ['.deadline', '.date'])
                    item['description'] = self._extract_from_soup(elem, ['.description', 'p'])[:500]
                    item['eligibility'] = ''
                    item['application_link'] = response.url
                    item['country'] = 'International'
                    item['degree_level'] = 'Any'
                    item['subject'] = 'Any'
                    item['source_url'] = response.url
                    item['source_name'] = response.url.split('/')[2]
                    
                    if item['name'] and len(item['name']) > 10:
                        yield item
                break
    
    def _extract_text(self, selector, css_selectors):
        """Extract text using multiple CSS selectors"""
        for css in css_selectors.split(', '):
            text = selector.css(f'{css}::text').get('').strip()
            if text:
                return text
        return ''
    
    def _extract_link(self, selector, css_selectors):
        """Extract link using multiple CSS selectors"""
        for css in css_selectors.split(', '):
            href = selector.css(css).get('')
            if href:
                return href
        return ''
    
    def _extract_from_soup(self, element, tags):
        """Extract text from BeautifulSoup element"""
        for tag in tags:
            found = element.find(tag)
            if found:
                return found.get_text().strip()
        return ''


class ScholarshipPortalSpider(scrapy.Spider):
    """
    Spider for scholarshipportal.com
    """
    name = 'scholarshipportal'
    
    start_urls = [
        'https://www.scholarshipportal.com/scholarships'
    ]
    
    def parse(self, response):
        """Parse scholarshipportal listings"""
        scholarships = response.css('.scholarship-item, .study-portal')
        
        for scholarship in scholarships:
            item = ScholarshipItem()
            item['name'] = scholarship.css('h3 a::text, .title::text').get('').strip()
            item['provider'] = scholarship.css('.institution::text, .university::text').get('')
            item['amount'] = scholarship.css('.scholarship-value::text').get('')
            item['deadline'] = scholarship.css('.deadline::text').get('')
            item['description'] = scholarship.css('.description::text').get('')
            item['eligibility'] = ''
            item['application_link'] = response.urljoin(
                scholarship.css('h3 a::attr(href)').get('')
            )
            item['country'] = scholarship.css('.destination::text, .country::text').get('International')
            item['degree_level'] = scholarship.css('.degree::text').get('Any')
            item['subject'] = scholarship.css('.subject::text').get('Any')
            item['source_url'] = response.url
            item['source_name'] = 'scholarshipportal.com'
            
            if item['name']:
                yield item
        
        # Pagination
        next_page = response.css('a.next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)


class GovernmentScholarshipSpider(scrapy.Spider):
    """
    Spider for government scholarship programs
    """
    name = 'government_scholarships'
    
    start_urls = [
        'https://educationusa.state.gov/opportunity/scholarships',
        'https://www.britishcouncil.org/study-uk/scholarships',
    ]
    
    def parse(self, response):
        """Parse government scholarship listings"""
        # Implementation varies by government site structure
        scholarships = response.css('.scholarship-listing, .opportunity')
        
        for scholarship in scholarships:
            item = ScholarshipItem()
            item['name'] = scholarship.css('h2, h3::text').get('')
            item['provider'] = 'Government'
            item['amount'] = scholarship.css('.funding::text').get('')
            item['deadline'] = scholarship.css('.deadline::text').get('')
            item['description'] = scholarship.css('.description::text').get('')
            item['eligibility'] = ''
            item['application_link'] = scholarship.css('a::attr(href)').get('')
            item['country'] = self._detect_country(response.url)
            item['degree_level'] = 'Any'
            item['subject'] = 'Any'
            item['source_url'] = response.url
            item['source_name'] = 'government'
            
            if item['name']:
                yield item
    
    def _detect_country(self, url):
        """Detect country from URL"""
        if 'state.gov' in url:
            return 'USA'
        elif 'britishcouncil' in url:
            return 'UK'
        return 'International'
