-- ============================================
-- LIFESTYLE VIRAL PLANNER - SUPABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste this > Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: videos
-- Stores all video content planning data
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic Information
    post_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'Ideia', 
        'Roteirizando', 
        'Takes Gravados', 
        'Editando', 
        'Agendado', 
        'Publicado'
    )),
    
    -- Viral Strategy
    hook_type TEXT CHECK (hook_type IN (
        'Curiosidade',
        'Pattern Interrupt',
        'Dor/Desejo',
        'Visual Impactante',
        'Pergunta Direta',
        'Afirmação Polêmica',
        ''
    )),
    visual_style TEXT CHECK (visual_style IN (
        'Slow Living',
        'Cinematic Travel',
        'Urbano Dinâmico',
        'Golden Hour',
        'Minimalista',
        'Energético / Esportivo',
        ''
    )),
    music_vibe TEXT CHECK (music_vibe IN (
        'Lo-fi / Calma',
        'Pop Inspirador',
        'Eletrônica Suave',
        'Épica / Orquestral',
        'Trend do Momento (Viral)',
        ''
    )),
    
    -- Creative Content
    concept TEXT,
    reference_link TEXT,
    voiceover TEXT,
    cta TEXT,
    notes TEXT,
    
    -- Future: Multi-user support
    user_id UUID DEFAULT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_post_date ON videos(post_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_week_number ON videos(week_number);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- ============================================
-- TABLE: app_config
-- Stores user configuration and preferences
-- ============================================
CREATE TABLE IF NOT EXISTS app_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Configuration fields
    app_title TEXT DEFAULT 'LIFESTYLE VIRAL',
    creator_name TEXT DEFAULT 'ATHLETE & CREATOR',
    weekly_goal TEXT DEFAULT '4 VÍDEOS POR SEMANA',
    weekly_goal_number INTEGER DEFAULT 4,
    word_preset TEXT DEFAULT 'Curto (5-6)',
    word_max INTEGER DEFAULT 6,
    
    -- Future: Multi-user support
    user_id UUID DEFAULT NULL
);

-- Create index for config lookup
CREATE INDEX IF NOT EXISTS idx_app_config_user_id ON app_config(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Currently disabled for single-user mode
-- Enable when adding authentication
-- ============================================

-- Enable RLS on tables (currently permissive for testing)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (single-user mode)
-- WARNING: This allows anyone with your URL to access data
-- Enable authentication and update policies for production multi-user app

CREATE POLICY "Allow all access to videos" ON videos
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all access to app_config" ON app_config
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- INITIAL DATA (Optional)
-- Uncomment to insert default configuration
-- ============================================

-- INSERT INTO app_config (
--     app_title,
--     creator_name,
--     weekly_goal,
--     weekly_goal_number,
--     word_preset,
--     word_max
-- ) VALUES (
--     'LIFESTYLE VIRAL',
--     'ATHLETE & CREATOR',
--     '4 VÍDEOS POR SEMANA',
--     4,
--     'Curto (5-6)',
--     6
-- );

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify your setup
-- ============================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('videos', 'app_config');

-- Check if indexes were created
-- SELECT indexname FROM pg_indexes 
-- WHERE schemaname = 'public' AND tablename IN ('videos', 'app_config');

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies 
-- WHERE schemaname = 'public';

-- ============================================
-- FUTURE ENHANCEMENTS
-- ============================================

-- When adding authentication, update RLS policies:
/*
-- Drop permissive policies
DROP POLICY "Allow all access to videos" ON videos;
DROP POLICY "Allow all access to app_config" ON app_config;

-- Add user-specific policies
CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON videos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON videos
    FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for app_config
CREATE POLICY "Users can view own config" ON app_config
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own config" ON app_config
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Verify tables exist in Table Editor
-- 2. Copy your Project URL and anon key from Settings > API
-- 3. Update config.js in your app with these credentials
-- 4. Test the connection!
