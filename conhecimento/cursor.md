# Advizall CRM - Technical Knowledge Base

## Business Context
Advizall is a Chicago-based marketing agency serving U.S. clients with services including website development, paid/organic media, brand identity, and business organization. The CRM system tracks prospects through a sales pipeline and converts them to active clients for project delivery and retention.

## Core Data Models

### Prospect
- Basic data: `id`, `contact_name`, `company_name`, `phone`, `email`
- Classification: `lead_source`, `business_type`, `score` (1-5)
- Location: `region_city`, `region_state`, `timezone`
- Status tracking: `status` (new, interested, negotiation, lost)
- Follow-up: `first_contact_at`, `next_follow_up_at`
- Notes: `call_summary`, `notes`

### Client (extends Prospect)
- Inherits all Prospect fields
- Additional fields: `full_address`, `website`, `social_links`
- Financial data: `plan_name`, `retainer_value`, `ad_budget`
- Client-specific status: active, inactive, delinquent
- Related entities: Projects, Payments, Credentials (secure)

### Projects
- Core attributes: `service` type, `status`, `description`, `deadline`
- Types: website, paid_ads, organic, branding, ops
- Status workflow: todo, doing, done

### Credentials (secured by role)
- Stores sensitive access data: `system`, `login`, `password`
- System types: hosting, domain, facebook, instagram, other
- Role-based visibility: only for moderators and admins

## Key Features & Implementation Challenges

### Prospect to Client Conversion
- **Critical Implementation**: Button remains visible for all prospects except those with 'lost' status
- Conversion creates a client record using prospect data
- Proper filtering prevents converted prospects from appearing in Prospects view
- Context handling is essential for ReactQuery function calls to avoid 'this' context loss

### Kanban Board Implementation
- Droppable zones for each status column
- Drag-and-drop updates prospect status through reorderProspects API
- Cards show key prospect information with score visualization
- Status visualization with color-coded badges

### Role-Based Security
- User roles: User, Moderator, Admin
- Credentials only visible to Moderator and Admin roles
- Row-Level Security (RLS) in Supabase for data access control

### Technical Challenges
- Context loss when using React Query - needs arrow function wrappers
- Proper filtering of prospects that have already been converted
- Local storage used for persistence in mock implementation (real app uses Supabase)
- Concurrent update patterns for Kanban drag-and-drop

## Implementation Stack
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Data Fetching: TanStack Query (React Query)
- Forms: React Hook Form + zod validation
- State Management: React Context + Query invalidation
- Storage: Supabase (PostgreSQL) / Mock services with localStorage
- Authentication: Supabase Auth

## Development Patterns
1. Each service uses a mock implementation that will be replaced with real Supabase calls
2. Converted records are tracked in localStorage for the mock implementation
3. Proper error handling with try/catch is essential in async operations
4. ReactQuery requires careful context handling with arrow functions
5. Components check client status asynchronously to control button visibility

## Common Issues
- Context loss in async functions ('this' unavailable in callbacks)
- Filter operations need careful implementation to maintain referential integrity
- Type conflicts between imported types and local declarations
- Status transition handling requires careful implementation

## Key User Flows
1. Prospect creation → status updates → client conversion
2. Client management with projects, payments, and secure credentials
3. Meeting scheduling with Google Calendar integration (planned)
4. Role-based credential access and management 