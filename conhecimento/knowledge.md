# CRM Advizall – Knowledge Base Specification (v1)

> **Purpose**: This document feeds Lovable’s Knowledge Base so the platform fully understands the business logic, data structure, user roles, workflows, and technical integrations required to deliver the complete *CRM Advizall* application.

---

## 1. Business Context
Advizall is a Chicago‑based marketing agency that acquires U.S. clients and delivers services such as website development, paid and organic media, brand identity, and overall business organization. The CRM must:
- Capture leads (prospects) and move them through a simple pipeline until they become active clients.
- Store sensitive technical credentials (hosting, domain, social media logins) **visible only to privileged roles**.
- Schedule follow‑ups & meetings via the company’s Google Calendar with automatic Google Meet links.
- Remain intuitive, minimal‑click, and cloud‑native while being future‑proof and secure.

---

## 2. User Roles
| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **User** | Regular salesperson / account exec | Read‑write on their own Prospects & Clients; no visibility to credential fields; cannot manage users. |
| **Moderator** | Senior staff / team lead | Full read‑write on all Prospects & Clients; sees credential fields; cannot manage users. |
| **Admin** | System owner | All Moderator rights **plus**: create/update/delete users; configure roles, integrations, and system settings. |

Authentication is **email + password** (no 2‑factor).

---

## 3. Lifecycle Stages
1. **Prospect** → 2. **Interested** → 3. **Negotiation** → 4. **Client Active** → 5. **Project Delivery** → 6. **Post‑Project / Retainer**

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
  - `payments[]` → `payment_id`, `amount`, `date`, `status`
- **Tasks** (Kanban) → `task_id`, `title`, `status`, `due_at`, `assignee_id`
- `documents[]` (files with meta)

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
### 6.1 Google Calendar & Meet
- Single company calendar: **meetings@advizall.com**
- On meeting creation (via N8n webhook):
  1. Call Google Calendar API → create event in client’s timezone.
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
| Payment recorded = failed | Flag Client status “Delinquent” + email finance team. |

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
| DB & Auth | **Supabase** (Postgres + RLS) | hosted, scalable, row‑level perms. |
| API / Automation | **N8n** | low‑code, Google integrations, webhook endpoints. |
| Front‑end | **Next.js (React) + TypeScript + Tailwind CSS + Shadcn/UI** | fast DX, modern UI, server components ready. |
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
1. **Schema & Roles** (DB + RLS) – 2 days
2. **Basic UI (Prospect pipeline)** – 3 days
3. **Convert to Client flow + credential module** – 3 days
4. **Google Calendar/Meet automation (N8n)** – 2 days
5. **Tasks & Kanban** – 2 days
6. **Finance module (payments)** – 2 days
7. **Dashboards & reports** – 3 days
8. **QA + UAT** – 3 days

_Total MVP: ≈ 20 dev days._

---

## 13. Acceptance Criteria (MVP)
- User can create Prospect, move card between stages, set follow‑up.
- One‑click convert Prospect → Client with data carryover.
- Moderator/Admin can view & edit credential fields; User cannot.
- Meeting creation autopopulates Google Calendar & returns Meet link.
- Dashboard shows pipeline counts and lead‑source conversion.
- All actions perform < 200 ms average server response under 50 concurrent users.

---

**End of Knowledge Base Document**

