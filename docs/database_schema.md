# Database Schema & Performance Analysis

This document contains the SQL schema for the playlist project and a theoretical benchmark of the architecture.

## 1. SQL Schema
This schema is designed for Supabase (PostgreSQL). It includes support for public sharing via slugs and Row Level Security (RLS) for access control.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles Table (for tracking terms acceptance and user metadata)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_accepted_at TIMESTAMPTZ,
  privacy_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Playlists Table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
  created_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT slug_length CHECK (char_length(slug) >= 3)
);

-- 3. Tracks Table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  platform TEXT NOT NULL, -- e.g., 'youtube', 'instagram', 'soundcloud'
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  position INTEGER NOT NULL, 
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_playlists_slug ON playlists(slug);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_tracks_playlist_id ON tracks(playlist_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- USER_PROFILES POLICIES
-- READ: Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- WRITE: Users can only modify their own profile
CREATE POLICY "Users can modify their own profile" 
ON user_profiles FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PLAYLISTS POLICIES
-- READ: Everyone can view a playlist if they have the link/slug
CREATE POLICY "Playlists are viewable by everyone" 
ON playlists FOR SELECT 
USING (true);

-- WRITE: Only the authenticated owner can modify the playlist
CREATE POLICY "Only owners can modify playlists" 
ON playlists FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- TRACKS POLICIES
-- READ: Everyone can view tracks belonging to any playlist
CREATE POLICY "Tracks are viewable by everyone" 
ON tracks FOR SELECT 
USING (true);

-- WRITE: Only the owner of the parent playlist can modify its tracks
CREATE POLICY "Only playlist owners can modify tracks" 
ON tracks FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM playlists 
    WHERE playlists.id = tracks.playlist_id 
    AND playlists.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM playlists 
    WHERE playlists.id = tracks.playlist_id 
    AND playlists.user_id = auth.uid()
  )
);
```

---

## 2. Performance Benchmark (Theoretical)

### Read Performance (The "Viral" Scenario)
- **Complexity**: $O(\log N)$
- **Verdict**: **EXCELLENT.**
- **Analysis**: B-Tree indexes on `slug` and `playlist_id` ensure fast lookups even with millions of records.

### Write Performance (Reordering)
- **Complexity**: $O(K)$ (where $K$ is number of shifted rows)
- **Verdict**: **MODERATE.**
- **Analysis**: Using `INTEGER` for position is simple but requires multiple updates during reorders. 
- **Future Solution**: Fractional Indexing.

### RLS Overhead
- **Complexity**: $O(1)$ additional lookup per record.
- **Verdict**: **GOOD.**
- **Analysis**: The `EXISTS` clause in track policies adds a slight tax but is manageable for standard playlist sizes.

### Scalability
- **Verdict**: **EXCELLENT.**
- **Analysis**: UUIDs prevent ID enumeration attacks and simplify future database migrations/merges.

## 3. Recommended Production Optimizations
To further optimize the database as the app grows, consider:
1. **Composite Index**: `CREATE INDEX idx_tracks_composite ON tracks(playlist_id, position);`
2. **Edge Caching**: Cache `slug` lookups at the CDN level.
3. **Fractional Indexing**: Switch from `INTEGER` to `FLOAT` for the `position` column.
