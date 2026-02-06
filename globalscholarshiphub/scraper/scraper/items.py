"""
Scrapy Items for Scholarship Data
"""
import scrapy
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ScholarshipItem(scrapy.Item):
    """Scrapy Item for scholarship data"""
    name = scrapy.Field()
    description = scrapy.Field()
    provider = scrapy.Field()
    eligibility = scrapy.Field()
    amount = scrapy.Field()
    currency = scrapy.Field()
    deadline = scrapy.Field()
    application_link = scrapy.Field()
    country = scrapy.Field()
    degree_level = scrapy.Field()
    subject = scrapy.Field()
    source_url = scrapy.Field()
    source_name = scrapy.Field()


class ScholarshipPydantic(BaseModel):
    """Pydantic model for data validation"""
    name: str = Field(..., min_length=5, max_length=500)
    description: Optional[str] = Field(None, max_length=5000)
    provider: Optional[str] = Field(None, max_length=255)
    eligibility: Optional[str] = Field(None, max_length=2000)
    amount: Optional[str] = Field(None, max_length=255)
    currency: Optional[str] = Field(default="USD", max_length=10)
    deadline: Optional[str] = None
    application_link: Optional[str] = None
    country: Optional[str] = Field(default="International", max_length=100)
    degree_level: Optional[str] = Field(default="Any", max_length=100)
    subject: Optional[str] = Field(default="Any", max_length=200)
    source_url: Optional[str] = None
    source_name: str = Field(..., max_length=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Fulbright Foreign Student Program",
                "provider": "U.S. Department of State",
                "amount": "Full funding",
                "deadline": "2024-10-15",
                "country": "USA",
                "degree_level": "Master",
                "subject": "Any",
                "source_name": "scholarshipportal"
            }
        }
