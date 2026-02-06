-- All Scholarships Hub - Database Schema
-- PostgreSQL Database Setup

-- Create database (run manually)
-- CREATE DATABASE scholarships;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MAIN TABLES
-- ============================================

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    provider VARCHAR(255),
    eligibility TEXT,
    amount VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'USD',
    deadline DATE,
    application_link TEXT,
    country VARCHAR(100) DEFAULT 'International',
    degree_level VARCHAR(100) DEFAULT 'Any',
    subject VARCHAR(200) DEFAULT 'Any',
    status VARCHAR(50) DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    source_url TEXT,
    source_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent duplicates based on name, provider, and deadline
    CONSTRAINT unique_scholarship UNIQUE (name, provider, deadline)
);

-- Comments for scholarships table
COMMENT ON TABLE scholarships IS 'Stores all scholarship opportunities';
COMMENT ON COLUMN scholarships.degree_level IS 'Bachelor, Master, PhD, High School, Any';
COMMENT ON COLUMN scholarships.status IS 'active, expired, archived';

-- Languages table for i18n
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_rtl BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    context VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(language_code, key)
);

-- Scraper logs table
CREATE TABLE IF NOT EXISTS scraper_logs (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100),
    items_scraped INTEGER DEFAULT 0,
    items_inserted INTEGER DEFAULT 0,
    items_duplicates INTEGER DEFAULT 0,
    items_errors INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table (for newsletter)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    country VARCHAR(100),
    degree_interest VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Scholarship indexes
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_scholarships_degree ON scholarships(degree_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_subject ON scholarships(subject);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_featured ON scholarships(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_scholarships_created ON scholarships(created_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_source ON scholarships(source_name);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_scholarships_search ON scholarships 
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(provider, '')));

-- Translation indexes
CREATE INDEX IF NOT EXISTS idx_translations_lang ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert supported languages
INSERT INTO languages (code, name, native_name, is_active, is_rtl) VALUES
    ('en', 'English', 'English', true, false),
    ('fr', 'French', 'Français', true, false),
    ('pt', 'Portuguese', 'Português', true, false),
    ('de', 'German', 'Deutsch', true, false),
    ('ar', 'Arabic', 'العربية', true, true),
    ('zh', 'Chinese', '中文', true, false)
ON CONFLICT (code) DO NOTHING;

-- Insert sample scholarships (for testing)
INSERT INTO scholarships (name, provider, description, amount, deadline, country, degree_level, subject, is_featured, source_name) VALUES
    ('Fulbright Foreign Student Program', 'U.S. Department of State', 
     'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.', 
     'Full Funding', '2024-10-15', 'USA', 'Master', 'Any', true, 'sample'),
    
    ('Chevening Scholarships', 'UK Foreign, Commonwealth & Development Office',
     'Chevening Scholarships are the UK government''s global scholarship program, funded by the Foreign, Commonwealth & Development Office.',
     'Full Funding', '2024-11-05', 'UK', 'Master', 'Any', true, 'sample'),
    
    ('Erasmus Mundus Joint Masters', 'European Union',
     'Erasmus Mundus Joint Masters are delivered by multiple higher education institutions and include study periods in different countries.',
     '€1,400/month', '2024-12-15', 'Europe', 'Master', 'Any', true, 'sample'),
    
    ('DAAD Scholarships', 'German Academic Exchange Service',
     'DAAD scholarships offer graduates the opportunity to continue their education in Germany with a postgraduate or continuing course of study.',
     '€850-1,200/month', '2024-10-31', 'Germany', 'Master', 'Any', true, 'sample'),
    
    ('Australia Awards Scholarships', 'Australian Government',
     'Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade.',
     'Full Funding', '2024-04-30', 'Australia', 'Any', 'Any', true, 'sample'),
    
    ('Gates Cambridge Scholarship', 'Bill & Melinda Gates Foundation',
     'Gates Cambridge Scholarships are awarded to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree.',
     'Full Funding', '2024-12-05', 'UK', 'PhD', 'Any', true, 'sample')
ON CONFLICT (name, provider, deadline) DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to scholarships
DROP TRIGGER IF EXISTS update_scholarships_updated_at ON scholarships;
CREATE TRIGGER update_scholarships_updated_at
    BEFORE UPDATE ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to translations
DROP TRIGGER IF EXISTS update_translations_updated_at ON translations;
CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get active scholarships
CREATE OR REPLACE FUNCTION get_active_scholarships(
    p_country VARCHAR DEFAULT NULL,
    p_degree VARCHAR DEFAULT NULL,
    p_subject VARCHAR DEFAULT NULL,
    p_search VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    provider VARCHAR,
    amount VARCHAR,
    deadline DATE,
    country VARCHAR,
    degree_level VARCHAR,
    subject VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.provider, s.amount, s.deadline, s.country, s.degree_level, s.subject
    FROM scholarships s
    WHERE s.status = 'active'
        AND (p_country IS NULL OR s.country ILIKE '%' || p_country || '%')
        AND (p_degree IS NULL OR s.degree_level ILIKE '%' || p_degree || '%')
        AND (p_subject IS NULL OR s.subject ILIKE '%' || p_subject || '%')
        AND (p_search IS NULL OR 
             s.name ILIKE '%' || p_search || '%' OR 
             s.description ILIKE '%' || p_search || '%' OR
             s.provider ILIKE '%' || p_search || '%')
    ORDER BY s.is_featured DESC, s.deadline ASC NULLS LAST
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- Featured scholarships view
CREATE OR REPLACE VIEW featured_scholarships AS
SELECT * FROM scholarships 
WHERE is_featured = true AND status = 'active'
ORDER BY deadline ASC;

-- Upcoming deadlines view
CREATE OR REPLACE VIEW upcoming_deadlines AS
SELECT * FROM scholarships 
WHERE status = 'active' 
    AND deadline >= CURRENT_DATE 
    AND deadline <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY deadline ASC;

-- Statistics view
CREATE OR REPLACE VIEW scholarship_stats AS
SELECT 
    COUNT(*) as total_scholarships,
    COUNT(*) FILTER (WHERE status = 'active') as active_scholarships,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_count,
    COUNT(DISTINCT country) as countries_count,
    COUNT(DISTINCT degree_level) as degree_levels_count
FROM scholarships;

-- ============================================
-- MAINTENANCE
-- ============================================

-- Archive expired scholarships (run periodically)
CREATE OR REPLACE FUNCTION archive_expired_scholarships()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    UPDATE scholarships 
    SET status = 'expired'
    WHERE deadline < CURRENT_DATE - INTERVAL '30 days'
        AND status = 'active';
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION archive_expired_scholarships() IS 
'Archives scholarships that have been expired for more than 30 days';
