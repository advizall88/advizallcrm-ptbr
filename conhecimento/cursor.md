# Advizall CRM - Technical Knowledge Base

## Business Context
Advizall is a Chicago-based marketing agency serving U.S. clients with services including website development, paid/organic media, brand identity, and business organization. The CRM system tracks prospects through a sales pipeline and converts them to active clients for project delivery and retention.

## Core Data Models

### Prospect
- Basic data: `id`, `contact_name`, `company_name`, `phone`, `email`
- Classification: `lead_source`, `business_type`, `score` (1-5)
- Location: `region_city`, `region_state`, `timezone`
- Status tracking: `status` (new, interested, negotiation, lost)
- Follow-up: `first_contact_at`, `next_follow_up_at`, `call_summary`, `notes`
- Timestamps: `created_at`, `updated_at`

### Client
- Basic data: `id`, `contact_name`, `company_name`, `phone`, `email`
- Classification: `business_type`
- Location: `region_city`, `region_state`, `timezone`
- Billing: `plan_name`, `monthly_fee`
- Onboarding: `first_contact_at`, `call_summary`
- Notes: `notes`
- Timestamps: `created_at`, `updated_at`

### Projects
- Basic data: `id`, `name`, `description`, `status` (proposed, active, completed, cancelled)
- Client relationship: `client_id`
- Tracking: `start_date`, `target_completion_date`, `completed_at`
- Billing: `total_value`, `payment_type` (fixed, hourly)
- Timestamps: `created_at`, `updated_at`

### Payment
- Basic data: `id`, `description`, `amount`
- Client relationship: `client_id`, optional `project_id`
- Tracking: `status` (pending, paid), `payment_date`
- Timestamps: `created_at`, `updated_at`

### Credential
- Basic data: `id`, `site_name`, `url`, `username`, `password`
- Client relationship: `client_id`
- Timestamps: `created_at`, `updated_at`

## Recent Implementation Changes

### Cal.com Meeting Scheduling Integration
- Implemented Cal.com as an embedded widget for scheduling meetings
- Created a reusable CalendarWidget component in `src/components/meetings/CalendarWidget.tsx`
- Integrated meeting scheduling capability in multiple parts of the application:
  - Main Meetings page via the "+ Schedule Meeting" button
  - Client details page via the "Schedule Meeting" button in Overview tab
  - Prospect details dialog via a dedicated "Schedule Meeting" button
- Used dynamic script loading to optimize performance
- Designed with extensibility to support future enhancements

### Client Details Route
- Added detailed client view with multiple tabs for projects, payments, credentials, etc.
- Implemented tabs for managing different aspects of client data
- Added ability to view and edit client profile information
- Fixed client details dialog to maintain consistent size and proper scrolling
- Added dedicated Notes tab for managing client notes
- Ensured all tabs have proper scrolling capability when content overflows

### Fixed DOM Nesting Issues
- Corrected improper DOM nesting structure in various components
- Ensured proper component architecture for better React rendering performance
- Resolved console warnings related to invalid HTML structure

### Improved Client Conversion Pipeline
- Enhanced the flow from prospect to client conversion
- Implemented data mapping to properly transfer prospect information to new clients
- Added validation for required client fields during conversion process

### Credentials Management
- Added secure storage and management of client login credentials
- Implemented password visibility toggle for credential security
- Created interface for adding and updating client login information

### Enhanced UI Components
- Improved modal dialogs for better user interaction
- Added form validation for data entry
- Implemented more responsive layouts for various screen sizes
- Fixed client dialog to maintain consistent height regardless of active tab
- Enhanced ScrollArea components for better content overflow handling

### Backup and Restore System
- Created comprehensive backup solutions for browser-based data
- Implemented Node.js scripts for server-side backups
- Added restore functionality to recover from backups
- Created bash scripts to automate the backup process

### Scroll Functionality in Forms
- Added scroll capability to the prospect and client detail dialogs
- Implemented ScrollArea component from the UI library to contain form content
- Set fixed height constraints on dialogs for consistent UI presentation
- Fixed issues with content overflow in all tabbed interfaces
- Made all form tabs scrollable with proper content overflow handling

## Key Features & Implementation Challenges

### Prospect to Client Conversion
- **Critical Implementation**: Button remains visible for all prospects except those with 'lost' status
- Conversion creates a client record using prospect data
- Proper filtering prevents converted prospects from appearing in Prospects view
- Context handling is essential for ReactQuery function calls to avoid 'this' context loss
- Client detail view accessible through `/clients/:id` route after conversion
- Converted clients persist in localStorage and are tracked in a separate 'convertedProspects' list

### Meeting Scheduling with Cal.com
- Embedded Cal.com widget via iframe for seamless user experience
- Dynamic script loading to reduce performance impact
- Consistent UI integration across client, prospect, and meetings sections
- Modal-based design with proper sizing and scrolling behavior
- Extensible implementation ready for future API integrations

### Kanban Board Implementation
- Droppable zones for each status column
- Drag-and-drop updates prospect status through reorderProspects API
- Cards show key prospect information with score visualization
- Status visualization with color-coded badges

### Role-Based Security
- User roles: User, Moderator, Admin
- Credentials only visible to Moderator and Admin roles
- Row-Level Security (RLS) in Supabase for data access control

### Data Backup and Restoration
- Browser-based backup system captures all localStorage data
- Node.js backup script for development environments
- Restoration system allows importing previously backed-up data
- Complete backup includes application state, localStorage, and mock database content

### Technical Challenges
- Context loss when using React Query - needs arrow function wrappers
- Proper filtering of prospects that have already been converted
- Local storage used for persistence in mock implementation (real app uses Supabase)
- Concurrent update patterns for Kanban drag-and-drop
- React DOM nesting validation (div cannot be nested inside p elements)
- Managing consistent UI sizing when using tabs with variable content height

## Implementation Stack
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Data Fetching: TanStack Query (React Query)
- Forms: React Hook Form + zod validation
- State Management: React Context + Query invalidation
- Storage: Supabase (PostgreSQL) / Mock services with localStorage
- Authentication: Supabase Auth
- Routing: React Router with route parameters for detail views
- Scheduling: Cal.com integration via embedded widget

## Development Patterns
1. Each service uses a mock implementation that will be replaced with real Supabase calls
2. Converted records are tracked in localStorage for the mock implementation
3. Proper error handling with try/catch is essential in async operations
4. ReactQuery requires careful context handling with arrow functions
5. Components check client status asynchronously to control button visibility
6. Route changes update URL with record IDs for direct linking (e.g., `/clients/:id`)

## Common Issues & Solutions
- Context loss in async functions - Use arrow functions to maintain 'this' context
- Filter operations - Implement consistent localStorage tracking with error handling
- Type conflicts - Ensure proper type definitions for consistent data handling
- DOM nesting violations - Replace nested divs with appropriate elements (p, span)
- Route handling - Add missing routes and URL parameters for complete navigation
- Data persistence - Use consistent localStorage keys with structured error handling
- UI consistency - Use fixed height containers with ScrollArea for proper content overflow

## Key User Flows
1. Prospect creation → status updates → client conversion → client detail view
2. Client management with projects, payments, and secure credentials
3. Meeting scheduling with Cal.com integration for clients and prospects
4. Role-based credential access and management
5. Database backup and restoration 