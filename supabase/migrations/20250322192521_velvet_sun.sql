/*
  # Schéma initial pour Un Monde en Mouvement

  1. Tables Principales
    - `users` : Utilisateurs inscrits
    - `personalities` : Personnalités médiatiques
    - `questions` : Questions proposées
    - `votes_personalities` : Votes pour les personnalités
    - `votes_questions` : Votes pour les questions
    - `waitlist` : Liste d'attente

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité pour chaque table
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Personalities table
CREATE TABLE personalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  description text,
  image_url text,
  category text NOT NULL CHECK (category IN ('Dirigeant de média', 'Journaliste', 'Influenceurs/Youtubeurs')),
  is_preselected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Votes for personalities
CREATE TABLE votes_personalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  personality_id uuid REFERENCES personalities(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, personality_id)
);

-- Votes for questions
CREATE TABLE votes_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  question_id uuid REFERENCES questions(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Waitlist table
CREATE TABLE waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes_personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Policies for personalities
CREATE POLICY "Anyone can read personalities" ON personalities
  FOR SELECT TO anon, authenticated
  USING (true);

-- Policies for questions
CREATE POLICY "Anyone can read questions" ON questions
  FOR SELECT TO anon, authenticated
  USING (true);

-- Policies for votes_personalities
CREATE POLICY "Users can read own votes on personalities" ON votes_personalities
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own votes on personalities" ON votes_personalities
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for votes_questions
CREATE POLICY "Users can read own votes on questions" ON votes_questions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own votes on questions" ON votes_questions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Functions for vote counting
CREATE OR REPLACE FUNCTION get_personality_votes_count(personality_uuid uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COUNT(*) FROM votes_personalities WHERE personality_id = personality_uuid;
$$;

CREATE OR REPLACE FUNCTION get_question_votes_count(question_uuid uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COUNT(*) FROM votes_questions WHERE question_id = question_uuid;
$$;