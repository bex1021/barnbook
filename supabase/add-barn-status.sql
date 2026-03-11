-- Add status column for barn review workflow
-- 'active'  = visible to public (default for all existing barns)
-- 'pending' = scraped / awaiting admin review
-- 'rejected' = admin rejected, hidden

ALTER TABLE barns
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'pending', 'rejected'));

-- Add horse leasing field
ALTER TABLE barns
  ADD COLUMN IF NOT EXISTS horse_leasing BOOLEAN DEFAULT FALSE;

-- Ensure existing barns are active
UPDATE barns SET status = 'active' WHERE status IS NULL;
