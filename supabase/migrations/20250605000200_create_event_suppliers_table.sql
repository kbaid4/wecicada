-- Migration: Create event_suppliers join table for event-supplier associations
CREATE TABLE IF NOT EXISTS event_suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES event_audit_logs(id) ON DELETE CASCADE,
    supplier_email text NOT NULL,
    supplier_user_id uuid REFERENCES profiles(id),
    invited_at timestamptz DEFAULT now()
);

-- Optional: Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_suppliers_event_id ON event_suppliers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_suppliers_supplier_email ON event_suppliers(supplier_email);
