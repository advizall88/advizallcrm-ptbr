
# CRM Advizall – Knowledge Base Specification (v1)

> **Purpose**: This document feeds Lovable's Knowledge Base so the platform fully understands the business logic, data structure, user roles, workflows, and technical integrations required to deliver the complete *CRM Advizall* application.

---

## 1. Business Context
Advizall is a Chicago‑based marketing agency that acquires U.S. clients and delivers services such as website development, paid and organic media, brand identity, and overall business organization. The CRM must:
- Capture leads (prospects) and move them through a simple pipeline until they become active clients.
- Store sensitive technical credentials (hosting, domain, social media logins) **visible only to privileged roles**.
- Schedule follow‑ups & meetings via the company's Google Calendar with automatic Google Meet links.
- Remain intuitive, minimal‑click, and cloud‑native while being future‑proof and secure.

---

## 2. User Roles
| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **User** | Regular salesperson / account exec | Read‑write on their own Prospects & Clients; no visibility to credential fields; cannot manage users. |
| **Moderator** | Senior staff / team lead | Full read‑write on all Prospects & Clients; sees credential fields; cannot manage users. |
| **Admin** | System owner | All Moderator rights **plus**: create/update/delete users; configure roles, integrations, and system settings. |

Authentication is **email + password** (no 2‑factor).

---

## 3. Lifecycle Stages
1. **Prospect** → 2. **Interested** → 3. **Negotiation** → 4. **Client Active** → 5. **Project Delivery** → 6. **Post‑Project / Retainer**

Prospect → Client conversion occurs with one click; all data is preserved and extended.

---

## 4. Core Data Entities & Fields
### 4.1 Prospect
- `id`
- `contact_name`
- `company_name` (nullable)
- `phone`
- `email`
- `lead_source` (Ads, Cold‑call, Referral, etc.)
- `business_type` (dropdown)
- `region_city`, `region_state`
- `score` (1–5)
- `status` (enum: New, Interested, Negotiation, Lost)
- `first_contact_at` (timestamp)
- `owner_user_id`
- `call_summary` (text)
- `notes` (text)
- `next_follow_up_at` (timestamp)
- `timezone`

### 4.2 Client
All Prospect fields **plus**:
- `full_address`
- `website`
- `social_links[]`
- **Credentials** (visible to Moderator & Admin only)
  - `hosting_login`, `hosting_password`
  - `domain_login`, `domain_password`
  - `social_login_*`, `social_password_*`
  - `other_credentials`
- **Project Info**
  - `services_enabled[]` (WebDev, PaidAds, Organic, Branding, BizOrg)
  - `service_status` per service
- **Finance**
  - `plan_name`, `retainer_value`, `ad_budget`
  - `payments[]` → `payment_id`, `amount`, `date`, `status`
- **Tasks** (Kanban) → `task_id`, `title`, `status`, `due_at`, `assignee_id`
- `documents[]` (files with meta)

### 4.3 Meeting
- `meeting_id`
- `client_id`
- `title`
- `scheduled_at` (timestamp)
- `event_id` (Google Calendar)
- `meet_link`

### 4.4 User
- `user_id`, `name`, `email`, `password_hash`, `role`

---

## 5. Permission Matrix (RLS)
| Entity / Action | User | Moderator | Admin |
|-----------------|------|-----------|-------|
| Read own Prospect/Client | ✔ | ✔ | ✔ |
| Read ALL Prospects/Clients | ✖ | ✔ | ✔ |
| View credential fields | ✖ | ✔ | ✔ |
| Create Prospect | ✔ | ✔ | ✔ |
| Convert Prospect → Client | ✔ (own) | ✔ | ✔ |
| CRUD Users | ✖ | ✖ | ✔ |
| System Settings | ✖ | ✖ | ✔ |

---

## 6. Integrations
### 6.1 Google Calendar & Meet
- Single company calendar: **meetings@advizall.com**
- On meeting creation (via N8n webhook):
  1. Call Google Calendar API → create event in client's timezone.
  2. Set `conferenceData.createRequest` to generate Meet link.
  3. Return `eventId` + `htmlLink` (Meet URL) → save in DB.
  4. Trigger email to client with .ICS + Meet link.

### 6.2 Email / Transactional
- SendGrid (or Supabase SMTP) for automatic invitations & reminders.

---

## 7. Automations & Workflows
| Trigger | Action |
|---------|--------|
| Prospect next_follow_up_at due | Email reminder to owner; optional task auto‑create. |
| Prospect converted → Client | Copy data, open Project board, prompt owner to define first tasks. |
| Meeting created | Store Meet link → send invitation to client + owner. |
| Payment recorded = failed | Flag Client status "Delinquent" + email finance team. |

---

## 8. Dashboards & Reports
- **Pipeline Board**: cards by stage with counts & drag‑drop.
- **Conversion Metrics**: New → Interested %, Interested → Client %, avg days per stage.
- **Lead Source ROI**: table & bar chart.
- **Recurring Revenue**: total retainer, upcoming renewals.

---

## 9. Tech Architecture
| Layer | Chosen Tech | Reason |
|-------|-------------|--------|
| DB & Auth | **Supabase** (Postgres + RLS) | hosted, scalable, row‑level perms. |
| API / Automation | **N8n** | low‑code, Google integrations, webhook endpoints. |
| Front‑end | **Next.js (React) + TypeScript + Tailwind CSS + Shadcn/UI** | fast DX, modern UI, server components ready. |
| Hosting | Vercel (front) & Supabase (db) | zero‑ops. |
| Charts | Recharts | lightweight, customizable. |
| CI/CD | GitHub Actions | lint, test, deploy. |

> **Futuristic Qualities**: serverless edge functions, optimistic UI, react‑query/ tanstack router, dark‑/light‑mode support, progressive web app readiness, and granular cache invalidation.

---

## 10. Security & Compliance
- HTTPS everywhere.
- Daily automated backups (Supabase)
- Role‑based access to credentials; passwords stored **plain** as per business requirement but encrypted at rest via DB storage layer.
- GDPR/CCPA note: Personal data export & delete endpoints (Admin only).

---

## 11. Glossary
| Term | Meaning |
|------|---------|
| *Prospect* | Lead not yet closed. |
| *Client Active* | Prospect who signed. |
| *Credential* | Login + password pair (hosting, domain, etc.). |
| *Meet Link* | Auto‑generated URL for Google Meet. |

---

## 12. Implementation Roadmap (Milestones)
1. **Schema & Roles** (DB + RLS) – 2 days
2. **Basic UI (Prospect pipeline)** – 3 days
3. **Convert to Client flow + credential module** – 3 days
4. **Google Calendar/Meet automation (N8n)** – 2 days
5. **Tasks & Kanban** – 2 days
6. **Finance module (payments)** – 2 days
7. **Dashboards & reports** – 3 days
8. **QA + UAT** – 3 days

_Total MVP: ≈ 20 dev days._

---

## 13. Acceptance Criteria (MVP)
- User can create Prospect, move card between stages, set follow‑up.
- One‑click convert Prospect → Client with data carryover.
- Moderator/Admin can view & edit credential fields; User cannot.
- Meeting creation autopopulates Google Calendar & returns Meet link.
- Dashboard shows pipeline counts and lead‑source conversion.
- All actions perform < 200 ms average server response under 50 concurrent users.

---

**End of Knowledge Base Document**

**Lovable Prompt – Comprehensive Specification for "CRM Advizall"**

---

### 1. Executive Summary
Advizall is a Chicago‑based marketing agency that acquires, onboards, and manages U.S. clients for web development, paid media, organic growth, brand identity, and business organization. We need a cloud‑native CRM that is **ultra‑intuitive** yet **future‑proof**, mapping the full life‑cycle from _cold prospect_ to _active client with live projects & recurring billings_.

This prompt delivers every detail—business logic, data model, UX guidelines, and target tech stack—so Lovable can generate a production‑ready application **without guesswork**.

---

### 2. Core Objectives
1. **Two‑step lifecycle**: _Prospecção_ (lead management) ➜ _Cliente Ativo_ (project & financial management).
2. **Lightning‑fast UI** with an opinionated workflow: users should never hunt for information.
3. **Central calendar integration**: every scheduled call/meeting writes to a single Google Calendar and auto‑generates a Google Meet link.
4. **Role‑based visibility**: _User_, _Moderator_, _Admin_—only Mods/Admins see stored credentials.
5. **Zero fluff**: no cursor‑tracking or "mouse follow" visuals; micro‑interactions only where they speed up work.

---

### 3. Tech Stack (must‑use)
- **Front‑end**: React 18 + Next.js 14 (App Router) + TypeScript.
- **Styling**: Tailwind CSS (v3) with **shadcn/ui** components and Radix UI primitives. Strict utility‑first; global CSS kept minimal.
- **State/Data**: TanStack Query v5 + React Context for auth.
- **Back‑end**: Supabase (PostgreSQL) with Row‑Level Security (RLS) and Supabase Auth (email+password). No 2FA.
- **Workflow & Integrations**: n8n self‑hosted. Nodes for Google Calendar API (calendar.events.insert with `conferenceData.createRequest`), SendGrid (mail), and Supabase triggers.
- **Testing**: Vitest + Playwright.
- **CI/CD**: GitHub Actions → Vercel (front) and Railway (n8n). Supabase hosted.

_All libraries must be the latest stable releases as of April 2025._

---

### 4. Data Model (PostgreSQL / Supabase)
| Table | Key Fields |
|-------|-----------|
| **users** | id (uuid, PK), role (enum: user/moderator/admin), name, email, password_hash, created_at |
| **prospects** | id, owner_id → users.id, name, company, phone, email, lead_source (enum), industry_type, city, state, timezone, score (int 1‑5), status (enum: new/interested/negotiation/lost), first_contact_at, summary, notes, next_follow_up_at |
| **clients** | id (maps from prospect id on conversion), account_manager_id → users.id, all prospect fields + address_full, website, socials_json, plan_name, monthly_fee, ad_budget, created_at |
| **credentials** | id, client_id → clients.id, system (enum: hosting/domain/facebook/instagram/other), login, password (plain text), notes, visible_to (enum: moderator, admin) |
| **projects** | id, client_id, service (enum: website, paid_ads, organic, branding, ops), status (enum: todo/doing/done), description, deadline |
| **tasks** | id, project_id, title, status (todo/doing/done), due_at, assignee_id → users.id |
| **payments** | id, client_id, amount, currency, description, invoice_date, paid (bool), paid_at |
| **meetings** | id, client_id, prospect_id (nullable), title, starts_at, ends_at, calendar_event_id, meet_link, created_by_id, notes |

_All timestamp columns are `timestamptz`.
RLS Policies_: users can `select` rows they own; moderators select all; admins full DML.

---

### 5. Functional Requirements
#### 5.1 Prospect Module
- Kanban pipeline (columns = status). Drag‑and‑drop updates status & writes `updated_at`.
- Create new prospect modal with minimal fields; advanced fields toggle.
- "Convert to Client" button moves record, copies all shared fields, and spawns default projects (Website, Paid Ads, Organic if selected).
- Follow‑up scheduler pops a date‑picker and writes to `next_follow_up_at` + triggers n8n notification 1 hr before.

#### 5.2 Client Module
- Tabbed interface: **Overview · Credentials · Projects · Finance · Files**.
- Credentials tab lists each credential row with eye‑icon to toggle visibility (only Mods/Admins).
- Projects tab = mini‑kanban per client. Add task inline.
- Finance tab lists payments with colored badges (Paid/Unpaid). "Create invoice" opens modal (no billing gateway yet).

#### 5.3 Meetings & Calendar
- Any user can click "Schedule Meeting" from prospect or client.
- Form: date/time (defaults to now+3 days), duration, title (autofills pattern), description.
- On submit ➜ Supabase RPC calls n8n webhook; n8n inserts event in `meetings@advizall.com`, returns `eventId`, `hangoutLink`; Supabase stores them in `meetings`.
- UI shows meeting chip with quick‑copy Meet link.
- Automatic email (SendGrid) to client with `.ics` attachment, Bcc: account_manager.

---

### 6. UI / UX Guidelines
- **Theme**: Light mode first; use Advizall's palette (primary #111827, secondary #A855F7, accent #22D3EE) with subtle neumorphism shadows. No mouse‑follow or excessive parallax.
- **Layout**: Shell with static sidebar (logo + nav) and topbar (profile, quick‑add).
- **Responsiveness**: Mobile breakpoint stacks kanban columns horizontally scrollable.
- Animations via `framer‑motion` at 120 ms ease‑in‑out for modals/cards.
- Error/success toasts (`sonner`) bottom‑right, auto‑dismiss 4 s.
- Use `zod` + `react‑hook‑form` for all forms with inline validation.

---

### 7. Security & Backups
- Passwords for credentials remain plain in DB → only accessible to Mods/Admins via RLS.
- App passwords (users) hashed with bcrypt @ Supabase Auth.
- Daily automated dumps (database + storage) to Supabase backups (14‑day retention), mirrored to AWS S3.

---

### 8. Future Scalability (non‑MVP)
- Stripe Billing integration for automatic invoices.
- Public client portal (Next.js route group `/portal/**`) with read‑only project status.
- Webhooks to pull ad‑spend metrics into Finance tab.

---

### 9. Deliverables
1. **GitHub repository** with mono‑repo structure (`apps/web`, `packages/ui`, `apps/n8n-workflows`).
2. CI/CD pipeline deploying to Vercel & Railway on `main` branch push.
3. Supabase SQL migrations (`supabase/migrations/*`).
4. Detailed README with setup scripts (`pnpm i && supabase start`).
5. Loom video walkthrough under 8 min.

---

### 10. Success Criteria
- Zero critical bugs in Playwright e2e suite.
- Creating a prospect ➜ converting to client ➜ scheduling a meeting takes <60 s total.
- Time to first render (TTFB) < 100 ms via Vercel edge.
- Lighthouse PWA score ≥ 90.
