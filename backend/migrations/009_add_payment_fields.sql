
-- Add missing fields to payments table if they don't exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS amount_due DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS apartment_id INT REFERENCES apartments(id) ON DELETE SET NULL;

-- Update existing payments to calculate amount_paid from payment_history
UPDATE payments p
SET amount_paid = COALESCE(
    (SELECT SUM(amount_paid) FROM payment_history WHERE payment_id = p.id),
    0
);

-- Update amount_due to match amount if not set
UPDATE payments SET amount_due = amount WHERE amount_due = 0;
