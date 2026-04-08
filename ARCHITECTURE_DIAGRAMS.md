# Architecture & Workflow Diagrams

## System Architecture

### High-Level Components Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Application                          │
│                    (Dark Theme, Responsive)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Header Component                     │  │
│  │         (Title, Logo, Real-time Status Badge)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Member List Container                       │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │  │
│  │  │ MemberCard │  │ MemberCard │  │ MemberCard │  ...  │  │
│  │  │(Selectable)│  │(Selectable)│  │(Selectable)│       │  │
│  │  └────────────┘  └────────────┘  └────────────┘       │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Date Selector Container                        │  │
│  │        (Date picker with validation)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Availability Status Container                  │  │
│  │                                                          │  │
│  │   Green/Red Indicator + Reason + Member Details        │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓ ↑
                       (API Calls)
                            ↓ ↑
┌─────────────────────────────────────────────────────────────────┐
│               Backend API (https://task.moraspirit.com)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET /api/members         POST /api/availability/check         │
│  └─────────────────┬──────────────────────────────────┘        │
│                    ↓                                             │
│          (Member Database)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### User Interaction → API → UI Update

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                             │
│                                                                  │
│  1. Page Load                                                    │
│     ↓                                                            │
│  2. [User Selects Member] (clicks card)                          │
│     ↓                                                            │
│  3. [User Selects Date] (picks date)                             │
│     ↓                                                            │
│  4. [System Triggers Availability Check]                        │
│                                                                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                    STATE UPDATES                                 │
│                                                                  │
│  Dashboard Component                                             │
│  ├─ [selectedMemberId] = "M1"                                   │
│  ├─ [selectedDate] = "2026-04-08"                              │
│  └─ [membersApi.loading] = true                                │
│     [availabilityApi.loading] = true                            │
│                                                                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                      API REQUESTS                                │
│                                                                  │
│  useApi Hook (membersApi)                                        │
│  └─ GET /api/members                                             │
│                                                                  │
│  useApi Hook (availabilityApi)                                   │
│  └─ POST /api/availability/check                                │
│     ├─ Body: { msp_id: "M1", date: "2026-04-08" }             │
│     └─ Headers: { Content-Type: "application/json" }           │
│                                                                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND PROCESSING                             │
│                                                                  │
│  1. Validate request format                                      │
│  2. Look up member                                               │
│  3. Check availability for date                                  │
│  4. Return response                                              │
│                                                                  │
│  Response (if available):                                        │
│  {                                                               │
│    requested_date: "2026-04-08",                               │
│    id: "M1",                                                     │
│    name: "Jane Doe",                                            │
│    role: "Developer",                                            │
│    status: "available"                                          │
│  }                                                               │
│                                                                  │
│  Response (if busy):                                             │
│  {                                                               │
│    requested_date: "2026-04-08",                               │
│    id: "M1",                                                     │
│    name: "Jane Doe",                                            │
│    role: "Developer",                                            │
│    status: "busy",                                              │
│    reason: "Client meeting scheduled"                           │
│  }                                                               │
│                                                                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                   STATE UPDATES (SUCCESS)                        │
│                                                                  │
│  availabilityApi.data = { ...response }                         │
│  availabilityApi.loading = false                                │
│  availabilityApi.error = null                                   │
│                                                                  │
└──────────────────────────┬─────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│              UI UPDATES / RE-RENDER                              │
│                                                                  │
│  AvailabilityStatus Component                                    │
│  ├─ Renders status indicator (green/red)                        │
│  ├─ Displays member name, role, date                            │
│  ├─ Shows reason if busy                                        │
│  └─ Clears loading spinner                                      │
│                                                                  │
│  Result visible to user:                                         │
│  ┌────────────────────────────────────────┐                     │
│  │ ✓ Jane Doe - Available                 │  (green)            │
│  │ Date: 2026-04-08                       │                     │
│  │ Role: Developer                        │                     │
│  └────────────────────────────────────────┘                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Communication

### Props Down, Events Up Pattern

```
Dashboard (State Management)
│
├─ members: Member[]
├─ selectedMemberId: string | null
├─ selectedDate: string | null
├─ membersApi: { data, loading, error, request }
└─ availabilityApi: { data, loading, error, request }
│
├─────────────────────────────────────────────────────────┐
│                                                         │
v                                                         │
Header Component                                          │
(Receives: nothing - static)                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
v                                                         │
MemberList                                               │
├─ Input Props:                                          │
│  ├─ members: Member[]                                 │
│  ├─ loading: boolean                                  │
│  ├─ error: ApiError | null                           │
│  ├─ selectedMemberId: string | null                  │
│  └─ onMemberSelect: (id: string) => void             │
│                                                        │
│  Output Events:                                        │
│  └─ onMemberSelect("M1")  ──────────────┐            │
│                                          │            │
└──────────────────────────┤               │            │
                           v               │            │
                   Sets selectedMemberId ──┘            │
                      in parent (Dashboard)             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
v                                                         │
DateSelector                                            │
├─ Input Props:                                          │
│  ├─ selectedDate: string | null                       │
│  └─ onDateChange: (date: string) => void             │
│                                                        │
│  Output Events:                                        │
│  └─ onDateChange("2026-04-08")  ──────────┐          │
│                                             │          │
└──────────────────────────┤                │          │
                           v                 │          │
                   Sets selectedDate ───────┘          │
                      in parent (Dashboard)             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
v                                                         │
AvailabilityStatus                                      │
├─ Input Props:                                          │
│  ├─ data: AvailabilityCheckResponse | null           │
│  ├─ loading: boolean                                  │
│  └─ error: ApiError | null                           │
│                                                        │
│  (No events - display only)                           │
│                                                        │
└──────────────────────────────────────────────────────────┘
```

---

## State Management Flow

### useApi Hook Pattern

```
Component
    │
    ├─ const membersApi = useApi<MembersListResponse>()
    │
    └─ membersApi exposes:
       ├─ .data: MembersListResponse | null
       ├─ .loading: boolean
       ├─ .error: ApiError | null
       │
       └─ .request(endpoint, method?, body?) → Promise<T>
          │
          ├─ Sets loading = true
          │
          ├─ Makes fetch request
          │
          ├─ Success:
          │  ├─ Parses JSON response
          │  ├─ Sets data = response
          │  └─ Sets loading = false
          │
          └─ Error:
             ├─ Catches error
             ├─ Sets error = { message, code }
             └─ Sets loading = false

Component Re-renders based on:
├─ data change → Shows content
├─ loading change → Shows spinner
└─ error change → Shows error alert
```

---

## Responsive Layout Breakpoints

### Grid Responsiveness

```
┌──────────────────────────────────────────────────────────────────┐
│                     MOBILE (< 640px)                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────┐                            │
│  │       Member Card 1            │                            │
│  │  Jane Doe                       │                            │
│  │  Developer                      │                            │
│  └────────────────────────────────┘                            │
│                                                                  │
│  ┌────────────────────────────────┐                            │
│  │       Member Card 2            │                            │
│  │  John Smith                     │                            │
│  │  Designer                       │                            │
│  └────────────────────────────────┘                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  TABLET (≥ 768px, md: breakpoint)                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │   Member Card 1       │  │   Member Card 2       │          │
│  │  Jane Doe             │  │  John Smith           │          │
│  │  Developer            │  │  Designer             │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │   Member Card 3       │  │   Member Card 4       │          │
│  │  Alice Brown          │  │  Bob Wilson           │          │
│  │  Manager              │  │  Engineer             │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  DESKTOP (≥ 1024px, lg: breakpoint)                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Card 1       │  │ Card 2       │  │ Card 3       │  ...     │
│  │Jane Doe      │  │John Smith    │  │Alice Brown   │          │
│  │Developer     │  │Designer      │  │Manager       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Card 4       │  │ Card 5       │  │ Card 6       │  ...     │
│  │Bob Wilson    │  │Carol Davis   │  │Dave Miller   │          │
│  │Engineer      │  │Analyst       │  │Lead Dev      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Grid Classes: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## API Request Sequence

### Member List Fetch (Page Load)

```
┌─────────────┐
│   Browser   │
│  Loads Page │
└─────┬───────┘
      │
      v
┌─────────────────────────────────┐
│ Next.js App renders             │
│ ├─ Dashboard component mounts   │
│ └─ useEffect triggers           │
└─────┬───────────────────────────┘
      │
      v
┌─────────────────────────────────┐
│ useApi Hook called:             │
│ .request('/api/members', 'GET') │
└─────┬───────────────────────────┘
      │
      v
┌──────────────────────────────────────┐
│ HTTP GET Request                     │
│ URL: https://task.moraspirit.com/api/members │
│ Headers: Content-Type: application/json
└─────┬────────────────────────────────┘
      │
      v
┌──────────────────────────────────────┐
│ Server Processing                    │
│ ├─ Query database                    │
│ ├─ Serialize members                 │
│ └─ Return JSON response              │
└─────┬────────────────────────────────┘
      │
      v
┌──────────────────────────────────────┐
│ HTTP 200 Response                    │
│ Body: {                              │
│   "count": 10,                       │
│   "members": [...]                   │
│ }                                    │
└─────┬────────────────────────────────┘
      │
      v
┌──────────────────────────────────────┐
│ Frontend Processing                  │
│ ├─ Parse JSON                        │
│ ├─ Update states                     │
│ ├─ setMembers(response.members)      │
│ └─ membersApi.loading = false        │
└─────┬────────────────────────────────┘
      │
      v
┌──────────────────────────────────────┐
│ React Re-renders                     │
│ ├─ MemberList shows member cards    │
│ ├─ No selection yet                  │
│ └─ UI updates                        │
└──────────────────────────────────────┘

Timeline: ~200-500ms total
```

---

## Availability Check Sequence

### After Member + Date Selection

```
┌───────────────┐
│ User selects: │
│ •Member: M1   │
│ •Date: 2026-04-08
└────────┬──────┘
         │
         v
┌──────────────────────────────┐
│ useState Triggers:           │
│ ├─setSelectedMemberId("M1")  │
│ ├─setSelectedDate("2026-04-08")
│ └─Component Re-renders       │
└────────┬────────────────────┘
         │
         v
┌──────────────────────────────────┐
│ useEffect Dependency Check       │
│ If (memberId && date changed):   │
│ └─ execute availability check    │
└────────┬────────────────────────┘
         │
         v
┌────────────────────────────────────────┐
│ Available API Requested:               │
│ POST /api/availability/check           │
│ Headers:                               │
│   Content-Type: application/json       │
│ Body: {                                │
│   "msp_id": "M1",                     │
│   "date": "2026-04-08"                │
│ }                                      │
└────────┬───────────────────────────────┘
         │
         v
┌────────────────────────────────────────┐
│ Server Processing                      │
│ ├─ Validate inputs                     │
│ ├─ Look up member "M1"                 │
│ ├─ Check schedule for 2026-04-08      │
│ ├─ Determine status (available/busy)  │
│ └─ Include reason if busy              │
└────────┬───────────────────────────────┘
         │
         v
┌────────────────────────────────────────┐
│ Response (200 OK):                     │
│ Available:                             │
│ {                                      │
│   "requested_date": "2026-04-08",    │
│   "id": "M1",                         │
│   "name": "Jane Doe",                 │
│   "role": "Developer",                │
│   "status": "available"               │
│ }                                      │
│                                        │
│ OR Busy:                               │
│ {                                      │
│   "requested_date": "2026-04-08",    │
│   "id": "M1",                         │
│   "name": "Jane Doe",                 │
│   "role": "Developer",                │
│   "status": "busy",                   │
│   "reason": "Client meeting"          │
│ }                                      │
└────────┬───────────────────────────────┘
         │
         v
┌────────────────────────────────────────┐
│ Frontend Processing:                   │
│ ├─ availabilityApi.data = response    │
│ ├─ availabilityApi.loading = false    │
│ ├─ availabilityApi.error = null       │
│ └─ Component updates                   │
└────────┬───────────────────────────────┘
         │
         v
┌────────────────────────────────────────┐
│ UI Renders AvailabilityStatus:         │
│                                        │
│ IF available:                          │
│ ┌──────────────────────────────────┐  │
│ │ ● Green Indicator                │  │
│ │ ✓ Available                      │  │
│ │ Jane Doe - Developer             │  │
│ │ Date: 2026-04-08                │  │
│ └──────────────────────────────────┘  │
│                                        │
│ IF busy:                               │
│ ┌──────────────────────────────────┐  │
│ │ ✗ Red Indicator                  │  │
│ │ ✗ Busy                           │  │
│ │ Jane Doe - Developer             │  │
│ │ Reason: Client meeting           │  │
│ │ Date: 2026-04-08                │  │
│ └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘

Timeline: ~200-500ms per check
```

---

## Error Handling Flow

### API Error Scenarios

```
4 Common Error Scenarios
│
├─ 1. Network Error
│   │
│   ├─Cause: Backend unreachable
│   │
│   └─Flow:
│     ├─ fetch() throws error
│     ├─ catch block executes
│     ├─ error.message: "Failed to fetch"
│     ├─ Sets: membersApi.error = { message, code }
│     ├─ Sets: membersApi.loading = false
│     └─ Component renders: <ErrorAlert />
│
├─ 2. Invalid Response Format
│   │
│   ├─Cause: Backend returns non-JSON or wrong structure
│   │
│   └─Flow:
│     ├─ response.json() throws error
│     ├─ catch block executes
│     ├─ Sets: api.error = { message, code }
│     └─ Component renders: <ErrorAlert />
│
├─ 3. HTTP Error (4xx, 5xx)
│   │
│   ├─Cause: Server returns non-200 status
│   │
│   └─Flow:
│     ├─ response.status !== 200
│     ├─ Throws: Error("API Error: 404 Not Found")
│     ├─ catch block executes
│     └─ Sets: api.error = { message }
│
└─ 4. Timeout (optional)
    │
    ├─Cause: Request takes too long
    │
    └─Implementation needed:
      ├─ Add AbortController
      ├─ Set timeout: 5000ms
      └─ Abort + throw error if exceeded
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────┐
│   GitHub    │
│ Repository  │
└──────┬──────┘
       │
       │ Push to main
       v
┌──────────────────┐
│  Vercel Detects  │
│  New Commit      │
└──────┬───────────┘
       │
       v
┌─────────────────────────────┐
│ Vercel Build Process:       │
│ ├─ npm install              │
│ ├─ npm run build            │
│ │  ├─ TypeScript compilation│
│ │  ├─ Tailwind CSS build    │
│ │  └─ Next.js build output  │
│ ├─ Load env variables       │
│ │  └─ NEXT_PUBLIC_API_URL   │
│ └─ Deploy to CDN            │
└──────┬──────────────────────┘
       │
       v
┌──────────────────────────┐
│ Live Deployment          │
│ URL: your-app.vercel.app │
└──────────────────────────┘
       │
       │ HTTPS
       v
┌──────────────────────────┐
│  User Browser            │
│  ↓                       │
│  next.js app             │
│  ↓                       │
│  https://task.moraspirit.com API │
└──────────────────────────┘
```

---

## Key Takeaways

```
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION FLOW SUMMARY                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User visits dashboard                                  │
│     ↓                                                       │
│  2. Members list fetches automatically (GET /api/members)  │
│     ↓                                                       │
│  3. Members display in responsive card grid                │
│     ↓                                                       │
│  4. User clicks member → Selection state updates           │
│     ↓                                                       │
│  5. User picks date → DateSelector validates input         │
│     ↓                                                       │
│  6. Availability check triggers                            │
│     (POST /api/availability/check)                         │
│     ↓                                                       │
│  7. Response received → AvailabilityStatus renders         │
│     ├─ Green (✓ Available)                                 │
│     └─ Red (✗ Busy + Reason)                               │
│     ↓                                                       │
│  8. User can change date for new check                     │
│     (Loop back to step 5)                                  │
│                                                             │
│  ERROR HANDLING:                                            │
│  - Network errors → ErrorAlert shown                       │
│  - Invalid responses → User-friendly message               │
│  - Empty states → Helpful guidance                         │
│                                                             │
│  PERFORMANCE:                                              │
│  - No unnecessary re-renders                               │
│  - Tailwind CSS only uses needed classes                   │
│  - Next.js automatic code splitting                        │
│                                                             │
│  ACCESSIBILITY:                                            │
│  - Keyboard navigation (Tab, Enter, Space)                 │
│  - ARIA labels on all interactive elements                 │
│  - Focus indicators visible                                │
│  - Color contrast WCAG AA compliant                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
