# MyInvoisAI Compliance and Simulation Platform

MyInvoisAI is a premium, high-fidelity platform designed to automate and simulate e-invoice ingestion, extraction, and validation in accordance with Malaysia's Inland Revenue Board (Lembaga Hasil Dalam Negeri Malaysia - LHDNM) standards.

The application allows users to ingest unstructured inputs (such as WhatsApp text messages and invoice documents), parse them using Gemini AI, route them through an automated agent pipeline, persist them to a database, sign them cryptographically, validate them against compliance parameters, and submit them directly to a mock representation of the official LHDN portal.

---

## Technical Architecture and Data Flow

The architecture consists of a client-side Next.js frontend, backend API routing endpoints, and a PostgreSQL database (configured via Supabase) to log transaction states and agent tool steps.

The data flow operates as follows:
1. Ingestion: Raw, unstructured inputs (WhatsApp text format, WhatsApp PDF invoices, or manual forms) are uploaded via the Live Agent Simulator.
2. AI Extraction: The payload is routed to the POST API `/api/agent/extract`, which prompts Gemini AI to parse SSM registration data, TINs, MSIC codes, buyer/supplier info, and financial metrics in accordance with the LHDN schema.
3. Pipeline Tool Replay: The database tracks each pipeline tool invoking step in the `mcp_tool_logs` table (including `extractor`, `dbWriter`, `validator`, and `qrSigner`). The frontend queries `/api/logs?invoiceId={invoiceId}` to replay this execution sequencer visually.
4. Auto-Review Modal: On step resolution, the frontend presents a review modal, allowing manual override before signing.
5. Redirection & Glowing Focus: Confirming the review routes the user to the Mock LHDN Documents directory with a `highlight` query parameter. This triggers a client-side temporary Row Glow animation to focus user attention on the newly submitted record.
6. Bilingual Mock Portal: Users can toggle between English and Bahasa Malaysia dynamically. All sidebar items, headers, metric cards, wizard forms, templates, policies, and notifications instantly update.

---

## Core Features

- Live Agent Simulator (/demo): A step-by-step visual graph simulation illustrating automated MCP tool pipelines. It loops through nodes (Ingestion -> AI Extraction -> Database Save -> LHDN Validation -> Crypto Signing) dynamically using database logs.
- Dedicated Roadmaps (/how-it-works): A dynamic guides page mapping the operational sequence of the compliance system.
- Integrations Configurator (/integrations): A configuration panel enabling organizations to set up credentials, including Client IDs, Secrets, MSIC classifications, and TIN credentials.
- Bilingual LHDN Mock Portal (/lhdn): A static clone of the MyInvois portal providing complete Bahasa Malaysia and English translation coverage across its 11 internal sub-pages:
  - Utama / Home (Quick link boxes and welcome banners)
  - Papan Pemuka / Dashboard (Self-issued vs intermediary charts and counters)
  - Dokumen Baru / New Document (A 5-step interactive creation wizard)
  - Dokumen / Documents Directory (High-performance table with search query filtering, and view detail modals)
  - Penyerahan / Submissions (Draft files directory with batch Excel upload popup simulations)
  - Templat Visual / Visual Templates (Standard B2B and retail layout presets)
  - Notifikasi / Notifications (System maintenance notices and quota limits)
  - Panduan Pengguna / User Guide (Step-by-step instructions)
  - Terma & Syarat / Terms & Conditions (LHDN regulatory warnings)
  - Polisi / Policies (Statutory data retention disclosures)
  - Perihal / About (System build logs and version controls)

---

## Technology Stack and Key Dependencies

- Framework: Next.js (App Router, static optimization, client-side React 18)
- Styling: Tailwind CSS, custom keyframes (pulse row shadow transitions)
- Animation: Framer Motion (slide down entries, fade-in transitions)
- Database: PostgreSQL (client-side pg bindings, schema.sql migrations)
- State Management & Utility Libraries: Radix UI, Lucide React icons, Supabase client
- AI & Validation: Google Gen AI SDK integration, QR code renderer

---

## Directory and File Structure

- `app/`
  - `page.tsx`: Landing page detailing features, client reviews, and links.
  - `demo/page.tsx`: Sequencer simulation, review overlays, WhatsApp preview frames, and agent nodes.
  - `how-it-works/page.tsx`: Operational roadmap visualization using connecting nodes and accordions.
  - `integrations/page.tsx`: Form for LHDN environment configurations.
  - `lhdn/page.tsx`: Layout container for LHDN Mock Portal sidebar, header, global language controls, and view router.
  - `verify/[id]/page.tsx`: Independent verification view rendering document validation status and public keys.
  - `api/`
    - `agent/extract/route.ts`: Endpoints handling AI parsing and validation database writes.
    - `logs/route.ts`: Database query routing to fetch execution sequence metrics.
    - `invoices/route.ts`: Dynamic fetch routing for LHDN portal grid elements.
- `components/`
  - `lhdn/`
    - `HomeView.tsx`: Portal introduction guidelines and user actions.
    - `DashboardView.tsx`: Core metrics grids and taxpayer type toggles.
    - `NewDocumentView.tsx`: Form wizard capturing basic information, supplier/buyer addresses, line items, and totals.
    - `DocumentsView.tsx`: Table layout incorporating filter chips, search input, and dynamic glows.
    - `InvoiceDetailView.tsx`: Detailed card visualization showing exact transaction values.
    - `SubmissionsView.tsx`: Draft directories and excel ingestion interfaces.
    - `VisualTemplatesView.tsx`: Grid representing active rendering templates.
    - `NotificationsView.tsx`: System alerts and warning queues.
    - `StaticPages.tsx`: Content files for guides, policies, and about data.

---

## Database Schema Configuration

Deploy the following tables in your PostgreSQL database instance to manage system state:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Invoices Table (LHDN Compliant Schema)
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  invoice_number text not null unique,
  invoice_type_code text not null check (invoice_type_code in ('01', '02', '03', '04')), -- 01: Invoice, 02: Credit, 03: Debit, 04: Refund
  raw_input_type text not null check (raw_input_type in ('whatsapp', 'pdf_upload', 'email', 'manual_pos')),
  
  supplier_name text not null,
  supplier_tin text not null,
  supplier_brn text not null,
  supplier_msic_code text not null,
  supplier_msic_desc text not null,
  supplier_state_code text not null,
  supplier_address text not null,
  supplier_contact text not null,
  supplier_email text not null,

  buyer_name text not null,
  buyer_tin text not null,
  buyer_brn text not null,
  buyer_state_code text not null,
  buyer_address text not null,
  buyer_contact text not null,
  buyer_email text not null,

  currency_code text not null default 'MYR',
  exchange_rate numeric(12, 6) default 1.000000,
  subtotal numeric(12, 2) not null,
  tax_total numeric(12, 2) not null,
  total_payable numeric(12, 2) not null,
  
  lhdn_status text not null check (lhdn_status in ('Pending Extraction', 'Extraction Failed', 'Validation Pending', 'Validated', 'Validation Failed')),
  lhdn_uuid text,
  lhdn_validation_date timestamp with time zone,
  lhdn_qr_url text,
  validation_errors jsonb,
  requires_immediate_submission boolean default false
);

-- 2. Line Items Table (Relational mapped details)
create table if not exists invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  description text not null,
  quantity numeric(12, 4) not null,
  unit_measurement text not null default 'EA',
  unit_price numeric(12, 2) not null,
  subtotal numeric(12, 2) not null,
  tax_type text not null check (tax_type in ('01', '02', '03', 'E', 'N/A')),
  tax_rate numeric(5, 2) not null default 0.00,
  tax_amount numeric(12, 2) not null,
  classification_code text not null default '022'
);

-- 3. MCP Tool Audit Trail
create table if not exists mcp_tool_logs (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mcp_server text not null,
  tool_name text not null,
  status text not null check (status in ('Invoked', 'Success', 'Error')),
  input_payload jsonb,
  output_response jsonb
);
```

---

## Environment Variables Configuration

Create a `.env.local` file at the root of the project and populate the following keys:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostgreSQL Connection String (for server actions and migrations)
DATABASE_URL=postgresql://postgres:password@host:port/dbname

# Gemini Generative AI Key
GEMINI_API_KEY=your_gemini_api_key
```

---

## Local Development and Build Commands

### Setup Dependencies
Install npm modules:
```bash
npm install
```

### Run Local Development Server
Launch the compiler watcher:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### Linting
Validate codebase constraints:
```bash
npm run lint
```

### Production Compilation
Generate optimized static bundles:
```bash
npm run build
```

### Production Startup
Spin up the compiled production build:
```bash
npm run start
```

---

## Translation Architecture

Bilingual selection utilizes client-side layout controllers in `app/lhdn/page.tsx` and context prop structures down to subcomponents:

- Language State: Uses a React state hooks `language: "EN" | "BM"` in the header block.
- Sidebar Map: The sidebar labels translate instantly via the `sidebarLabels` record mapping.
- Sub-components: Subcomponents bind to the `language` parameter and use checks (e.g. `const isBM = language === "BM"`) to dynamically swap labels, placeholders, lists, error messages, and totals fields instantly.
- Layout Retention: All layouts preserve exact sizes, borders, colors, and layouts during text swaps to prevent structural displacement.
