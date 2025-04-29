# Cal.com API v1 – Consolidated Reference

> **Source:** <https://cal.com/docs/api-reference/v1/introduction> and linked sub‑pages – content consolidated for offline use.  
> Only navigation chrome, multi‑language duplicates, and “Was this page helpful?” blocks were removed.

---

## 1 · Getting Started

### 1.1 Quick start citeturn1view0
* Generate an **API key** in **Settings → Security**.  
* Install an HTTP client (e.g., `axios`, `requests`).  
  ```bash
  # Node / Yarn
  npm install axios        # or  yarn add axios

  # Python
  pip install requests
  ```
* Make your first call:  
  ```bash
  curl "https://api.cal.com/v1/event-types?apiKey=<YOUR_KEY>"
  ```
* A Postman collection with common calls is also available.

### 1.2 Authentication citeturn5search3
Cal.com uses **API keys** passed as the query parameter `apiKey`.  
Keys prefixed with `cal_` are test keys, `cal_live_` are live keys.  
Keep them secret – never commit them to public repos.

### 1.3 Errors citeturn14view0
| Code | Meaning | Typical reason |
|------|---------|----------------|
| 200 | OK | Everything worked |
| 400 | Bad Request | Missing/invalid parameter |
| 401 | Unauthorized | No / wrong `apiKey` |
| 402 | Request Failed | Parameters valid but action failed |
| 403 | Forbidden | Key lacks permission |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate‑limit exceeded |
| 5xx | Server errors | Rare internal failure |

### 1.4 Rate limits citeturn15view0
Every response includes:
* **X‑RateLimit‑Limit** – max requests allowed
* **X‑RateLimit‑Remaining** – requests left in the window
* **X‑RateLimit‑Reset** – UTC epoch when the window resets  

Exceeding the limit returns **429 Too Many Requests**.

---

## 2 · Endpoint Catalogue

Unless noted, **all endpoints require the `apiKey` query parameter** and return JSON.

### 2.1 Attendees
| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/attendees`|List all attendees citeturn3view0|
| POST   | `/attendees`|Create a new attendee citeturn4view0|
| GET    | `/attendees/{id}`|Get a single attendee citeturn10view0|
| PATCH | `/attendees/{id}`|Edit an attendee|
| DELETE | `/attendees/{id}`|Remove an attendee|

<details><summary>Body – Create / Edit</summary>

```json
{
  "bookingId": 123,
  "email": "[email protected]",
  "name": "John Doe",
  "timeZone": "America/Chicago"
}
```
</details>

---

### 2.2 Availabilities citeturn12view0
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/availabilities` | Create availability |
| GET | `/availabilities/{id}` | Get availability |
| PATCH | `/availabilities/{id}` | Update availability |
| DELETE | `/availabilities/{id}` | Delete availability |

<details><summary>Body (create)</summary>

```json
{
  "scheduleId": 123,
  "days": [1,2,3,5],
  "startTime": "1970‑01‑01T17:00:00.000Z",
  "endTime": "1970‑01‑01T21:00:00.000Z"
}
```
</details>

---

### 2.3 Booking References
`/booking-references` follows the same CRUD pattern (list/create/get/update/delete).

### 2.4 Bookings
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/bookings` | **Create a booking** (core operation) |
| DELETE | `/bookings/{uid}` | Cancel booking |
| GET | `/bookings/{uid}` | Get booking |
| PATCH | `/bookings/{uid}` | Edit booking |
| GET | `/bookings/{uid}/recordings` | List video recordings |
| GET | `/bookings/{uid}/transcripts` | List video transcripts |

### 2.5 Credentials
`/credentials` – store and manage third‑party app credentials (CRUD).

### 2.6 Destination Calendars
`/destination-calendars` – manage which calendar events are written to.

### 2.7 Event Types
Manage templates for meetings (`/event-types`). Includes team‑scoped endpoints like `/event-types/team/{teamId}`.

### 2.8 Memberships
Team membership management (`/memberships`).

### 2.9 Payments
Read‑only endpoints: `/payments` and `/payments/{id}`.

### 2.10 Schedules
`/schedules` – working‑hour blocks; CRUD.

### 2.11 Selected Calendars
Specify which connected calendars Cal.com reads for conflicts (`/selected-calendars`).

### 2.12 Slots
`GET /slots` – Query bookable time‑slots between a `startDateTime` and `endDateTime`.

### 2.13 Teams
Create, list and manage teams (`/teams`).

### 2.14 Users
User management endpoints (`/users`). Regular API keys may be limited to your own user.

### 2.15 Webhooks
Register callbacks for booking events (`/webhooks`).

---

## 3 · Common Request Headers

```text
Content-Type: application/json
```

## 4 · Change log

API v1 is considered **stable** but superseded by v2 for new integrations.

---

### Appendix A – Sample cURL (Create Booking)

```bash
curl --request POST   --url "https://api.cal.com/v1/bookings?apiKey=<YOUR_KEY>"   --header "Content-Type: application/json"   --data '{
    "eventTypeId": 987,
    "startTime": "2025-05-01T15:00:00Z",
    "endTime":   "2025-05-01T15:30:00Z",
    "name":      "Andre Souza",
    "email":     "[email protected]",
    "timeZone":  "America/Chicago"
  }'
```

---

*All information is reproduced from Cal.com’s public documentation (April 29 2025).*

