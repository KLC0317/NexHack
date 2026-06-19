-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Invoices Table (LHDN Compliant Schema)
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  invoice_number text not null unique, -- Internal Tracking Number
  invoice_type_code text not null check (invoice_type_code in ('01', '02', '03', '04')), -- 01: Invoice, 02: Credit, 03: Debit, 04: Refund
  raw_input_type text not null check (raw_input_type in ('whatsapp', 'pdf_upload', 'email', 'manual_pos')),
  
  -- Supplier Details (SST & SSM Registered)
  supplier_name text not null,
  supplier_tin text not null,
  supplier_brn text not null, -- SSM Registration No.
  supplier_msic_code text not null, -- 5-digit Malaysia Standard Industrial Classification
  supplier_msic_desc text not null,
  supplier_state_code text not null, -- LHDN State codes (e.g., '14' for KL, '10' for Selangor)
  supplier_address text not null,
  supplier_contact text not null,
  supplier_email text not null,

  -- Buyer Details
  buyer_name text not null, -- Or "General Public" for Consolidated e-Invoices
  buyer_tin text not null, -- Use 'EI00000000010' for Consolidated, 'EI00000000020' for Foreign Buyers
  buyer_brn text not null, -- Or "000000000000" if individual without BRN
  buyer_state_code text not null, -- State code '17' only allowed for Consolidated or Cross-Border
  buyer_address text not null,
  buyer_contact text not null,
  buyer_email text not null,

  -- Financial Details (Strict plain numeric format, NO scientific notation allowed by LHDN)
  currency_code text not null default 'MYR',
  exchange_rate numeric(12, 6) default 1.000000,
  subtotal numeric(12, 2) not null,
  tax_total numeric(12, 2) not null,
  total_payable numeric(12, 2) not null,
  
  -- LHDN Metadata (CTC Model Response)
  lhdn_status text not null check (lhdn_status in ('Pending Extraction', 'Extraction Failed', 'Validation Pending', 'Validated', 'Validation Failed')),
  lhdn_uuid text, -- Assigned by LHDN portal upon validation
  lhdn_validation_date timestamp with time zone,
  lhdn_qr_url text, -- Verification link with UUID query param
  validation_errors jsonb, -- Exact JSON output of LHDN API errors
  requires_immediate_submission boolean default false -- True if transaction >= RM10,000 (Mandatory Phase 4 Individual rule)
);

-- 2. Line Items Table (Relational mapped details)
create table if not exists invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric(12, 4) not null,
  unit_measurement text not null default 'EA', -- LHDN accepted unit codes (e.g., 'EA', 'Hectare')
  unit_price numeric(12, 2) not null,
  subtotal numeric(12, 2) not null,
  tax_type text not null check (tax_type in ('01', '02', '03', 'E', 'N/A')), -- 01: SST, 02: Service Tax, E: Tax Exempt
  tax_rate numeric(5, 2) not null default 0.00,
  tax_amount numeric(12, 2) not null,
  classification_code text not null default '022' -- Standard item classification
);

-- 3. MCP Tool Audit Trail
create table if not exists mcp_tool_logs (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mcp_server text not null, -- e.g., 'supabase-db-mcp', 'lhdn-validator-mcp'
  tool_name text not null, -- e.g., 'write_extracted_invoice', 'validate_ubl_rules'
  status text not null check (status in ('Invoked', 'Success', 'Error')),
  input_payload jsonb,
  output_response jsonb
);

-- Enable Realtime
begin;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table mcp_tool_logs;
commit;
