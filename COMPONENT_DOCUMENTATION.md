# Component Documentation

## Overview

This document provides detailed information about each component, including purpose, props, state, and usage examples.

---

## Dashboard Component

**File:** `components/Dashboard.tsx`

### Purpose
Central orchestrator component that manages application state and coordinates data flow between child components.

### Key Responsibilities
1. Fetch member list on mount
2. Manage member selection state
3. Manage date selection state
4. Trigger availability checks when member and date are selected
5. Coordinate API calls and error handling

### State Management

```typescript
const [members, setMembers] = useState<Member[]>([]);
const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [dismissedError, setDismissedError] = useState(false);

const membersApi = useApi<MembersListResponse>();  // For member list
const availabilityApi = useApi<AvailabilityCheckResponse>();  // For availability check
```

### Data Flow Diagram

```
┌─────────────────────────────────────┐
│     Dashboard Component             │
├─────────────────────────────────────┤
│                                     │
│  useEffect #1: Fetch Members        │
│  ├─ Runs on mount                   │
│  └─ Populates members list          │
│                                     │
│  useEffect #2: Check Availability   │
│  ├─ Runs when selectedMemberId     │
│  │  or selectedDate changes         │
│  └─ Calls availability API          │
│                                     │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┬───────────────┐
        │                     │               │
        v                     v               v
    ┌────────────┐    ┌──────────────┐ ┌────────────────┐
    │   Header   │    │ MemberList   │ │  DateSelector  │
    └────────────┘    │  & Cards     │ │                │
                      └──────────────┘ └────────────────┘
                               │
                       ┌───────v────────┐
                       │ AvailabilityStatus
                       │ + Error Alerts │
                       └────────────────┘
```

### Child Components
- `Header`: Displays application title
- `MemberList`: Renders member grid with selection
- `DateSelector`: Date input with validation
- `AvailabilityStatus`: Status display and member info

### Error Handling

```typescript
// Member list errors
if (membersApi.error) {
  return <ErrorAlert message={error.message} ... />
}

// Availability check errors
if (availabilityApi.error && !dismissedError) {
  return <ErrorAlert onDismiss={() => setDismissedError(true)} ... />
}
```

---

## MemberList Component

**File:** `components/MemberList.tsx`

### Purpose
Displays all members in a responsive card grid layout.

### Props

```typescript
interface MemberListProps {
  members: Member[];                    // Array of members
  loading: boolean;                     // Loading state
  error: { message: string } | null;    // Error state
  selectedMemberId: string | null;      // Currently selected member ID
  onMemberSelect: (memberId: string) => void;  // Selection callback
}
```

### Features

1. **Grid Layout**
   - 1 column on mobile
   - 2 columns on tablet (md)
   - 3 columns on desktop (lg)
   - Responsive gap spacing

2. **Loading State**
   - Shows animated spinner
   - Centered in viewport

3. **Error State**
   - Displays error alert with message
   - Clear visual indication

4. **Empty State**
   - Shows "No members found" message
   - Centered text

5. **Member Count**
   - Displays total member count
   - Yellow colored for emphasis

### Responsive Behavior

```
Mobile (1 column)      Tablet (2 columns)     Desktop (3 columns)
┌─────────┐           ┌─────────┬─────────┐  ┌─────────┬─────────┬─────────┐
│ Member1 │           │ Member1 │ Member2 │  │ Member1 │ Member2 │ Member3 │
├─────────┤           ├─────────┼─────────┤  ├─────────┼─────────┼─────────┤
│ Member2 │           │ Member3 │ Member4 │  │ Member4 │ Member5 │ Member6 │
├─────────┤           ├─────────┼─────────┤  ├─────────┼─────────┼─────────┤
│ Member3 │           │ Member5 │ Member6 │  │ Member7 │ Member8 │ Member9 │
└─────────┘           └─────────┴─────────┘  └─────────┴─────────┴─────────┘
```

### Layout Rationale

**Why Cards Instead of Grid Table?**

| Criterion | Cards | Table Grid |
|-----------|-------|-----------|
| **Spacing** | Comfortable padding | Dense data |
| **Responsive** | Wraps naturally | Complex breakpoints |
| **Selection UI** | Clear visual highlight | Checkbox/radio |
| **Sortable** | Not ideal | Good for sorting |
| **Touch-friendly** | ✅ Large targets | ❌ Small targets |
| **Scalable** | ✅ Add badges | ❌ Limited space |

**Decision:** Cards are superior for this use case because:
- Each member has limited information (3 fields: name, role, ID)
- Selection is one-at-a-time (not multi-select)
- Touch/mobile-first design
- Better visual hierarchy
- Easier to extend with future features

---

## MemberCard Component

**File:** `components/MemberCard.tsx`

### Purpose
Displays individual member information and handles selection.

### Props

```typescript
interface MemberCardProps {
  member: Member;                // Member data
  isSelected: boolean;           // Selection state
  onSelect: (memberId: string) => void;  // Selection handler
}
```

### Features

1. **Visual States**
   - Default: Gray border, dark background
   - Hover: Lighter border
   - Selected: Yellow border, shadow glow effect

2. **Selection Indicator**
   - Yellow circle with dot inside
   - Only visible when selected

3. **Information Display**
   - Member name (large, bold)
   - Role (smaller, gray)
   - Member ID (smallest, very subtle)

4. **Accessibility**
   - Keyboard navigation: Tab to focus
   - Keyboard selection: Enter or Space
   - ARIA labels for screen readers
   - `role="button"` and `aria-pressed`

### Styling Details

```typescript
// Default state
border-2 border-gray-700 bg-gray-800 hover:border-gray-600

// Selected state
border-2 border-accent-yellow bg-gray-800 shadow-lg shadow-accent-yellow/20
```

### Interaction Flow

```
User focuses card (Tab key)
         ↓
Card has visible focus ring
         ↓
User presses Enter or Space
         ↓
onSelect callback fired
         ↓
Parent updates selectedMemberId state
         ↓
MemberCard re-renders with isSelected=true
         ↓
Yellow border and indicator appear
```

---

## DateSelector Component

**File:** `components/DateSelector.tsx`

### Purpose
Allows user to select a date for availability checking.

### Props

```typescript
interface DateSelectorProps {
  selectedDate: string | null;        // ISO format date (YYYY-MM-DD)
  onDateChange: (date: string) => void;  // Date change callback
}
```

### Features

1. **Date Input**
   - HTML5 native date picker
   - Auto-formatted for mobile/browser
   - Platform-specific UI (calendar on mobile, picker on desktop)

2. **Min Date Validation**
   - Prevents selecting past dates
   - Set to today on component mount
   - Updated dynamically

3. **Default Value**
   - Auto-selects today's date on first load
   - User can override afterward

4. **Display**
   - Shows selected date in yellow text
   - Clear label and instructions

### Date Format

```typescript
// ISO 8601 format (required by HTML5 date input)
new Date().toISOString().split('T')[0]
// Returns: "2026-04-08"
```

### Browser Support

- ✅ Chrome/Edge: Native date picker + calendar
- ✅ Firefox: Date input with fallback
- ✅ Safari: Date input
- ✅ Mobile: Native date picker
- ⚠️ IE11: Text fallback (polyfill needed if supporting)

---

## AvailabilityStatus Component

**File:** `components/AvailabilityStatus.tsx`

### Purpose
Displays member availability status with visual indicators and reasoning.

### Props

```typescript
interface AvailabilityStatusProps {
  data: AvailabilityCheckResponse | null;      // API response
  loading: boolean;                            // Loading state
  error: { message: string } | null;           // Error state
}
```

### Features

1. **Status Indicators**
   - ✓ **Green** for available members
   - ✗ **Red** for busy members
   - Colored dot + background

2. **Member Information Display**
   - Full name (large)
   - Role and ID (smaller)
   - Requested date

3. **Reason Display**
   - Only shown when status is "busy"
   - Red/yellow bordered box
   - Clearly labeled "Reason for unavailability"

4. **Loading State**
   - Animated skeleton/pulse effect
   - Placeholder bars

5. **Error State**
   - Red background
   - Clear error message
   - Distinct visual treatment

### Visual States

```
Available Status:
┌─────────────────────────────────────┐
│ ● (green dot)                       │
│ Jane Doe | Manager                  │
│ Date: 2026-04-08                    │
│ ✓ Available                         │
└─────────────────────────────────────┘

Busy Status:
┌─────────────────────────────────────┐
│ ✗ (red dot)                         │
│ John Smith | Developer              │
│ Date: 2026-04-09                    │
│ ✗ Busy                              │
├─ Reason: In client meeting          │
└─────────────────────────────────────┘
```

### Color Scheme

```typescript
// Available
border-green-600 bg-green-900/20

// Busy
border-accent-red bg-red-900/20
```

---

## Header Component

**File:** `components/Header.tsx`

### Purpose
Application header with branding and navigation area.

### Features

1. **Sticky Positioning**
   - `sticky top-0 z-40`
   - Stays at top when scrolling
   - Doesn't overlap main content

2. **Layout**
   - Centered max-width container (7xl)
   - Flex layout for alignment
   - Padding for breathing room

3. **Branding**
   - Colored dot indicator
   - Application title
   - Subtitle (Real-time Availability Check)

4. **Responsive Design**
   - Full-width on mobile
   - Contained on desktop
   - Proper padding adjustments

### Styling

```typescript
// Sticky header effect
sticky top-0 z-40 bg-gray-800 border-b border-gray-700

// Gradient indicator dot
bg-gradient-to-r from-accent-yellow to-accent-red
```

---

## LoadingSpinner Component

**File:** `components/LoadingSpinner.tsx`

### Purpose
Animated loading indicator for async operations.

### Features

1. **Animation**
   - Outer static ring (gray)
   - Inner spinning ring (yellow)
   - Continuous rotation

2. **Size**
   - 48px diameter
   - Medium size, clearly visible
   - Centered on page

3. **Text**
   - "Loading..." text below spinner
   - Gray colored
   - Medium font weight

### CSS Animation

```css
animation: spin 1s linear infinite;
```

The inner ring uses:
```typescript
border-4 border-transparent border-t-accent-yellow border-r-accent-yellow
```

---

## ErrorAlert Component

**File:** `components/ErrorAlert.tsx`

### Purpose
Display error messages with clear visual distinction.

### Props

```typescript
interface ErrorAlertProps {
  title: string;                    // Error title
  message: string;                  // Error message
  onDismiss?: () => void;          // Optional dismiss callback
}
```

### Features

1. **Visual Design**
   - Red left border
   - Subtle red background
   - Warning icon

2. **Content**
   - Bold title
   - Detailed message
   - Dismissible (optional)

3. **Dismiss Button**
   - X icon
   - Hover effect
   - Calls onDismiss callback

### Styling

```typescript
bg-accent-red/10 border-l-4 border-accent-red rounded-lg

// States
Text: accent-red (title), gray-300 (message)
Icon: accent-red with opacity
```

### Usage

```typescript
// With dismiss
<ErrorAlert
  title="Member Load Failed"
  message="Could not fetch members from API"
  onDismiss={() => setError(null)}
/>

// Without dismiss
<ErrorAlert
  title="API Error"
  message="Server returned 500 error"
/>
```

---

## useApi Hook

**File:** `hooks/useApi.ts`

### Purpose
Reusable logic for making API requests with automatic state management.

### Type Signature

```typescript
function useApi<T>(): {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  request: (endpoint: string, method?: string, body?: object) => Promise<T>;
}
```

### Features

1. **Automatic State Management**
   - Loading state during request
   - Data state on success
   - Error state on failure

2. **Type Safety**
   - Generic type parameter `<T>` for response type
   - TypeScript catches missing properties

3. **Error Handling**
   - Network errors
   - HTTP errors (non-200)
   - JSON parse errors
   - All caught and stored in `error` state

4. **CORS Support**
   - Headers for JSON requests
   - GET and POST methods

### Usage Example

```typescript
// Setup
const membersApi = useApi<MembersListResponse>();

// Fetch data
useEffect(() => {
  const fetch = async () => {
    try {
      await membersApi.request('/api/members', 'GET');
    } catch (error) {
      // Error returned to hook state
    }
  };
  fetch();
}, []);

// Use state
if (membersApi.loading) return <LoadingSpinner />;
if (membersApi.error) return <ErrorAlert message={membersApi.error.message} />;
if (membersApi.data) {
  // Render member list
}
```

### POST Request Example

```typescript
const availabilityApi = useApi<AvailabilityCheckResponse>();

const payload = {
  msp_id: 'M1',
  date: '2026-04-08',
};

await availabilityApi.request('/api/availability/check', 'POST', payload);
```

### API Base URL

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task.moraspirit.com';

// Full request URL = API_BASE_URL + endpoint
// Example: https://task.moraspirit.com/api/members
```

---

## Type Definitions

**File:** `types/index.ts`

### Member

```typescript
interface Member {
  id: string;        // Unique identifier (e.g., "M1")
  name: string;      // Full name (e.g., "Jane Doe")
  role: string;      // Job role (e.g., "Senior Developer")
}
```

### MembersListResponse

```typescript
interface MembersListResponse {
  count: number;     // Total number of members
  members: Member[]; // Array of member objects
}

// Example:
{
  "count": 10,
  "members": [
    { "id": "M1", "name": "Jane Doe", "role": "Developer" },
    { "id": "M2", "name": "John Smith", "role": "Designer" }
  ]
}
```

### AvailabilityCheckRequest

```typescript
interface AvailabilityCheckRequest {
  msp_id: string;   // Member ID from Member object
  date: string;     // ISO 8601 date (YYYY-MM-DD)
}

// Example:
{
  "msp_id": "M1",
  "date": "2026-04-08"
}
```

### AvailabilityCheckResponse

```typescript
interface AvailabilityCheckResponse {
  requested_date: string;      // ISO date of request
  id: string;                  // Member ID
  name: string;                // Member name
  role: string;                // Member role
  status: 'available' | 'busy'; // Availability status
  reason?: string;             // (Optional) Reason if busy
}

// Example - Available:
{
  "requested_date": "2026-04-08",
  "id": "M1",
  "name": "Jane Doe",
  "role": "Developer",
  "status": "available"
}

// Example - Busy:
{
  "requested_date": "2026-04-08",
  "id": "M2",
  "name": "John Smith",
  "role": "Designer",
  "status": "busy",
  "reason": "Client meeting with budget review"
}
```

### ApiError

```typescript
interface ApiError {
  message: string;    // Human-readable error message
  code?: string;      // Optional error code
}
```

---

## Testing Components

### Manual Testing Checklist

#### Dashboard
- [ ] Members load on mount
- [ ] Selecting member highlights it
- [ ] Date field shows today by default
- [ ] Availability check triggers on date change
- [ ] Error alerts dismiss correctly

#### MemberList
- [ ] Grid displays all members
- [ ] Responsive layout (test on mobile/tablet/desktop)
- [ ] Member count displays correctly
- [ ] Loading spinner appears during fetch
- [ ] Error alert appears on API failure

#### MemberCard
- [ ] Card highlights on click
- [ ] Yellow border appears when selected
- [ ] Selection indicator dot visible
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Card returns to normal state when deselected

#### DateSelector
- [ ] Date input appears
- [ ] Cannot select past dates
- [ ] Selected date displays below input
- [ ] Today's date is default

#### AvailabilityStatus
- [ ] Green indicator for available
- [ ] Red indicator for busy
- [ ] Reason displays only when busy
- [ ] Loading animation appears during check
- [ ] Error state displays correctly

---

## Performance Considerations

1. **Component Optimization**
   - Cards use `key={member.id}` for efficient list rendering
   - No unnecessary re-renders due to hook dependencies

2. **CSS**
   - Tailwind generates only used classes
   - No inline styles (uses class-based styling)

3. **Images**
   - No images in current implementation (uses gradients)
   - Future: Use Next.js Image component

4. **API Calls**
   - No request waterfalls (sequential requests)
   - Debounce (optional) if adding search functionality

---

## Accessibility Compliance

- **WCAG 2.1 Level AA** target
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Color contrast (4.5:1 ratio)
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Alt text (if images added)

---

## Troubleshooting Components

### MemberList Shows "No members found"
1. Check API response in browser DevTools → Network
2. Verify member objects have `id`, `name`, `role`
3. Confirm API returns data in correct structure

### AvailabilityStatus not showing
1. Verify member is selected
2. Verify date is selected
3. Check API response format matches interface

### Styling looks wrong
1. Ensure Tailwind is built: `npm run build`
2. Restart dev server: `npm run dev`
3. Clear browser cache: Ctrl+Shift+Delete

### Date selector not working on mobile
1. Check browser supports HTML5 date input
2. Try setting date via dev tools to test
3. Provide fallback text input if needed
