-- Delete all active sessions, accounts, verifications, users, and profiles
TRUNCATE TABLE neon_auth.session CASCADE;
TRUNCATE TABLE neon_auth.account CASCADE;
TRUNCATE TABLE neon_auth.verification CASCADE;
TRUNCATE TABLE neon_auth.user CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
