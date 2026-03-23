-- Migration: Fix last_login column typo
-- Rename the incorrectly named lsat_login column to last_login

ALTER TABLE users RENAME COLUMN lsat_login TO last_login;
