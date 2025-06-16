-- Migration: Create planners table
CREATE TABLE IF NOT EXISTS planners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Migration: Create liaisons table
CREATE TABLE IF NOT EXISTS liaisons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);
