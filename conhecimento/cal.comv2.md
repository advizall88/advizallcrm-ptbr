# Cal.com API v2 – Consolidated Reference

> **Source:** <https://cal.com/docs/api-reference/v2/introduction> and every linked endpoint page – content consolidated for offline use.  
> Navigation chrome, language duplicates, and feedback widgets were removed.

---

## 1 · Getting Started

### 1.1 Base URL & Version Header citeturn7view0  
`https://api.cal.com/v2`  
All requests **must** include an up‑to‑date `cal-api-version` header.  
Example (current stable):  

```http
cal-api-version: 2024-08-13
```

### 1.2 Authentication Methods citeturn1view0  

| Method | When to use | How |
|--------|-------------|-----|
| **API key** | Personal integrations | `Authorization: Bearer cal_live_…` |
| **OAuth client credentials** | Platform customers managing managed users, creating client webhooks, or any `Teams`/`Orgs` resources | Headers: `x-cal-client-id: <id>`, `x-cal-secret-key: <secret>` |
| **Managed user access token** | Acting on behalf of a managed user (schedules, event types, bookings) | `Authorization: Bearer <access‑token>` (valid 60 min; refresh token valid 1 year) |

> **Tip:** Platform plans do **not** use API keys; rely on OAuth or managed‑user tokens instead.

### 1.3 Rate Limits citeturn8search1  
Every response contains:

| Header | Description |
|--------|-------------|
| `X‑RateLimit‑Limit` | Max requests in the current window |
| `X‑RateLimit‑Remaining` | Requests left |
| `X‑RateLimit‑Reset` | Epoch timestamp when the window resets |

Exceeding the limit returns **429 Too Many Requests**.

---

## 2 · Endpoint Catalogue (abridged)

Below is the full endpoint index exactly as presented in the docs.  
Unless noted, prepend `/v2/` and include the authentication + version header.

<details><summary><strong>Platform</strong> (managed multi‑tenant)</summary>

| Resource | Methods |
|----------|---------|
| **Managed Users** | `GET /platform/managed-users`, `POST /platform/managed-users`, `GET /platform/managed-users/{id}`, `DELETE /platform/managed-users/{id}`, `PATCH /platform/managed-users/{id}`, `POST /platform/managed-users/{id}/force-refresh-tokens`, `POST /platform/managed-users/{id}/refresh-tokens` |
| **Webhooks** | `GET /platform/webhooks`, `POST /platform/webhooks`, `DELETE /platform/webhooks`, `GET /platform/webhooks/{id}`, `DELETE /platform/webhooks/{id}`, `PATCH /platform/webhooks/{id}` |

</details>

<details><summary><strong>Organizations (Orgs)</strong></summary>

* **Attributes** – CRUD attributes + options; assign/unassign to users  
* **Bookings** – `GET /orgs/{orgId}/bookings`  
* **Delegation Credentials** – save / update  
* **Memberships** – CRUD team/org memberships  
* **Routing Forms & Responses** – list & update responses  
* **Schedules** – `GET /orgs/{orgId}/schedules`  
* **Teams** – full team management (`GET/POST/GET/{id}/DEL/PATCH`) incl. sub‑resources (bookings, conferencing, event‑types, memberships, routing forms, member schedules)  
* **Users** – CRUD users + sub‑resources (bookings, OOO, schedules)  
* **Webhooks** – CRUD org‑level webhooks |

</details>

<details><summary><strong>Core (no prefix)</strong></summary>

| Category | Key Endpoints |
|----------|---------------|
| **Bookings** | list, create, get, reschedule, cancel, confirm/decline, mark absence, reassign host, add‑to‑calendar |
| **Calendars** | save/check ICS feed, busy times, connect/disconnect Google/Outlook/Apple, check connection |
| **Conferencing** | connect app, OAuth URL, callback, list, set/get default, disconnect |
| **Destination Calendars** | `PUT /destination-calendars` |
| **Event Types** | CRUD |
| **Event Types / Webhooks** | CRUD |
| **Managed Orgs** | CRUD child organizations |
| **Me** | `GET /me`, `PATCH /me` |
| **OAuth Clients** | CRUD |
| **Routing Forms** | `POST /routing-forms/slots` |
| **Schedules** | list/create/get/default/delete/update |
| **Selected Calendars** | add / delete |
| **Slots** | availability lookup, reserve / get / update / delete reservation |
| **Stripe** | connect URL, save credentials, check connection |
| **Teams** | CRUD + sub‑resources (event types, memberships, phone calls) |
| **Webhooks** | global CRUD |

</details>

> **Complete schema:** an official OpenAPI 3 spec (≈ 650 KB) is available at `docs/api-reference/v2/openapi.json` in the Cal.com GitHub repo. citeturn9view0

---

## 3 · Sample Requests

### 3.1 Create a Booking citeturn7view0

```bash
curl --request POST   --url https://api.cal.com/v2/bookings   --header "Content-Type: application/json"   --header "cal-api-version: 2024-08-13"   --header "Authorization: Bearer cal_live_xxx"   --data '{
    "start": "2025-05-02T14:00:00Z",
    "attendee": {
      "name": "Andre Souza",
      "email": "[email protected]",
      "timeZone": "America/Chicago"
    },
    "eventTypeId": 123
  }'
```

### 3.2 Reserve a Slot

```bash
curl --request POST   --url "https://api.cal.com/v2/slots/reservations"   --header "cal-api-version: 2024-08-13"   --data '{"slotUid":"abc123"}'
```

---

## 4 · Key Differences vs v1 citeturn5view0

* **Version header** – every request now requires `cal-api-version`.  
* **Improved response objects** – richer, more consistent JSON.  
* **New OAuth & Platform concepts** – managed users, child orgs, etc.  
* **Performance & security** enhancements across the board.

---

*All information reproduced from Cal.com public docs (April 29 2025).*

