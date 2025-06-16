-- Migration: Add serviceType column to profiles table
ALTER TABLE profiles
ADD COLUMN serviceType text;
