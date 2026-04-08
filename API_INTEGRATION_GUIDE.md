# API Integration Guide

## Overview

This document provides comprehensive information about integrating with the Member Status API backend endpoints.

---

## API Endpoints

### 1. Member List Endpoint

**Endpoint:** `GET /api/members`

**Base URL:** `https://task.moraspirit.com` (configured via `NEXT_PUBLIC_API_URL`)

**Full URL:** `https://task.moraspirit.com/api/members`

**Method:** `GET`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Response Format:**

```typescript
{
  "count": 10,
  "members": [
    {
      "id": "M1",
      "name": "Jane Doe",
      "role": "Senior Developer"
    },
    {
      "id": "M2",
      "name": "John Smith",
      "role": "Product Manager"
    },
    // ... more members
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved members
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `500 Internal Server Error` - Server error

**Example cURL:**
```bash
curl -X GET https://task.moraspirit.com/api/members \
  -H "Content-Type: application/json"
```

**Frontend Usage:**
```typescript
// In Dashboard component
useEffect(() => {
  const fetchMembers = async () => {
    const response = await membersApi.request('/api/members', 'GET');
    setMembers(response.members);
  };
  fetchMembers();
}, []);
```

---

### 2. Availability Check Endpoint

**Endpoint:** `POST /api/availability/check`

**Base URL:** `https://task.moraspirit.com`

**Full URL:** `https://task.moraspirit.com/api/availability/check`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```typescript
{
  "msp_id": "M1",
  "date": "2026-04-08"
}
```

**Field Descriptions:**
- `msp_id` (string): Member ID from the member list (e.g., "M1", "M2")
- `date` (string): ISO 8601 format date (YYYY-MM-DD)

**Response Format - If Available:**

```typescript
{
  "requested_date": "2026-04-08",
  "id": "M1",
  "name": "Jane Doe",
  "role": "Senior Developer",
  "status": "available"
}
```

**Response Format - If Busy:**

```typescript
{
  "requested_date": "2026-04-08",
  "id": "M1",
  "name": "Jane Doe",
  "role": "Senior Developer",
  "status": "busy",
  "reason": "Client meeting - Budget Review"
}
```

**Field Descriptions:**
- `requested_date`: The date that was checked
- `id`: Member ID
- `name`: Member full name
- `role`: Member job role
- `status`: Either "available" or "busy"
- `reason`: (Optional) Only present when status is "busy"

**Status Codes:**
- `200 OK` - Successfully checked availability
- `400 Bad Request` - Invalid request (missing fields, wrong format)
- `404 Not Found` - Member ID not found
- `500 Internal Server Error` - Server error

**Example cURL - Available:**
```bash
curl -X POST https://task.moraspirit.com/api/availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "msp_id": "M1",
    "date": "2026-04-08"
  }'
```

**Example cURL - Busy:**
```bash
curl -X POST https://task.moraspirit.com/api/availability/check \
  -H "Content-Type: application/json" \
  -d '{
    "msp_id": "M2",
    "date": "2026-04-10"
  }'
```

**Frontend Usage:**
```typescript
// In Dashboard component
useEffect(() => {
  if (!selectedMemberId || !selectedDate) return;

  const checkAvailability = async () => {
    const payload = {
      msp_id: selectedMemberId,
      date: selectedDate,
    };
    await availabilityApi.request(
      '/api/availability/check',
      'POST',
      payload
    );
  };

  checkAvailability();
}, [selectedMemberId, selectedDate]);
```

---

## API Integration Flow

### Complete User Journey

```
1. User opens dashboard
   ↓
2. Frontend fetches members from GET /api/members
   ↓
3. Members display in grid (showing: name, role, ID)
   ↓
4. User selects a member from grid
   ↓
5. Date selector appears (defaults to today)
   ↓
6. Frontend fetches availability from POST /api/availability/check
   ├─ Body: { msp_id: "M1", date: "2026-04-08" }
   ↓
7. Response received:
   ├─ If status = "available" → Show green indicator
   ├─ If status = "busy" → Show red indicator + reason
   ↓
8. User can select different date
   ↓
9. New availability check is triggered (repeat step 6)
```

---

## Error Handling Strategy

### Frontend Error Handling

The frontend uses the `useApi` hook to handle all API errors uniformly:

```typescript
const membersApi = useApi<MembersListResponse>();

// If error occurs, it's stored in membersApi.error
// Component renders ErrorAlert component with error message
```

### Common Errors and Handling

#### 1. Network Errors

**Cause:** Backend unreachable

**Frontend Behavior:**
```
membersApi.error = {
  message: "Failed to fetch https://task.moraspirit.com/api/members",
  code: "API_ERROR"
}
```

**User Message:** "Failed to load members"

**Recovery:** User can refresh page

**Detection:**
```typescript
if (membersApi.error?.message.includes('Failed to fetch')) {
  // Network error - can suggest refreshing
}
```

#### 2. Invalid Response Format

**Cause:** Backend returns unexpected JSON

**Frontend Behavior:**
```
availabilityApi.error = {
  message: "API Error: 400 Bad Request",
  code: "API_ERROR"
}
```

**User Message:** Error alert with API error text

#### 3. Member Not Found (404)

**Cause:** Member ID doesn't exist

**Scenario:**
- Frontend sends: `{ msp_id: "INVALID", date: "2026-04-08" }`
- Backend returns: `404 Not Found`

**Frontend Behavior:**
```
availabilityApi.error = {
  message: "API Error: Not Found",
  code: "API_ERROR"
}
```

**User Message:** "Could not check availability"

#### 4. Server Error (500)

**Cause:** Backend server error

**Frontend Behavior:**
```
availabilityApi.error = {
  message: "API Error: Internal Server Error",
  code: "API_ERROR"
}
```

**User Message:** "Server error. Please try again later."

---

## Environment Configuration

### Setting API URL

**File:** `.env.local`

```bash
# Development (local backend)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Production (deployed backend)
NEXT_PUBLIC_API_URL=https://api.task.moraspirit.com

# Default fallback
NEXT_PUBLIC_API_URL=https://task.moraspirit.com
```

### Using in Code

```typescript
// In hooks/useApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task.moraspirit.com';

// Makes requests to:
// Development: http://localhost:5000/api/members
// Production: https://api.task.moraspirit.com/api/members
```

---

## CORS Configuration

### What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security feature. When the frontend and backend are on different domains, the browser requires CORS headers.

### Frontend Domain Examples

**Development:**
- `http://localhost:3000` (Next.js dev server)

**Deployment:**
- `https://your-dashboard.vercel.app` (Vercel)
- `https://your-dashboard.netlify.app` (Netlify)
- `https://yourdomain.com` (Custom domain)

### Backend CORS Requirements

Backend must return these headers:

```
Access-Control-Allow-Origin: https://your-dashboard.vercel.app
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true (if using cookies)
```

### Example Node.js/Express Backend

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',           // Development
  'https://your-dashboard.vercel.app', // Vercel deployment
  'https://yourdomain.com'             // Production
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### Debugging CORS Errors

In browser console, you might see:
```
Cross-Origin Request Blocked: (Reason: Missing CORS header ...)
```

**Solution:**
1. Contact backend team
2. Provide your frontend URL
3. Ask them to add it to CORS allowed origins
4. Wait for deployment

---

## Testing the API Integration

### Using Browser DevTools

1. **Open DevTools:** `F12` or `Cmd+Option+I`
2. **Go to Network tab**
3. **Reload page**
4. **Watch for API calls:**
   - Look for `/api/members` request
   - Look for `/api/availability/check` request
5. **Click request to inspect:**
   - Headers tab: See request headers
   - Preview tab: See response JSON
   - Response tab: See full response

### Using cURL (Command Line)

**Test Member List:**
```bash
curl -X GET https://task.moraspirit.com/api/members \
  -H "Content-Type: application/json" \
  -v
```

**Test Availability Check:**
```bash
curl -X POST https://task.moraspirit.com/api/availability/check \
  -H "Content-Type: application/json" \
  -d '{"msp_id":"M1","date":"2026-04-08"}' \
  -v
```

The `-v` flag shows all headers (useful for debugging)

### Using Postman

1. **Import Postman** if not already installed
2. **Create new GET request**
   - URL: `https://task.moraspirit.com/api/members`
   - Headers: `Content-Type: application/json`
   - Send
3. **Create new POST request**
   - URL: `https://task.moraspirit.com/api/availability/check`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "msp_id": "M1",
       "date": "2026-04-08"
     }
     ```
   - Send

---

## API Response Validation

The frontend validates responses against TypeScript interfaces:

```typescript
// types/index.ts defines expected shape

interface MembersListResponse {
  count: number;
  members: Member[];
}

interface AvailabilityCheckResponse {
  requested_date: string;
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy';
  reason?: string;
}
```

### Validation in useApi Hook

```typescript
// If response doesn't match the interface:
// - TypeScript compilation error (during build)
// - Runtime error (if backend returns wrong shape)

const response = await response.json() as T;  // Type assertion
// ^ This is unsafe! But matches backend contract
```

### If Backend Returns Wrong Format

**Scenario:** Backend returns `status_code` instead of `status`

**Result:**
- TypeScript catches this in development
- Component tries to use `data.status` → undefined
- UI shows "available" because `undefined !== 'busy'`

**Solution:)**
1. Check API response in browser DevTools
2. Verify it matches interface
3. Contact backend team if mismatch
4. Update interface if backend changed intentionally

---

## Caching Strategies

### Current Implementation

No caching - every selection triggers a new API request.

### When to Add Caching

```typescript
// Example: Don't fetch same member/date twice

const cacheKey = `${memberId}-${date}`;
if (cache.has(cacheKey)) {
  setData(cache.get(cacheKey));
} else {
  const response = await fetch(...);
  cache.set(cacheKey, response);
  setData(response);
}
```

### Caching Libraries

**React Query** (recommended for larger apps):
```typescript
const query = useQuery({
  queryKey: ['availability', memberId, date],
  queryFn: () => checkAvailability(memberId, date),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## Performance Optimization

### Request Timing

**Current Flow:**
1. Member list loads: ~200-500ms (network)
2. User selects member: Instant
3. Availability check: ~200-500ms (network)

### Optimization: Prefetching

```typescript
// Pre-fetch all members' availability for common dates

const preloadAvailability = async (startDate: Date, endDate: Date) => {
  members.forEach(member => {
    for (let date = startDate; date <= endDate; date += 1 day) {
      availabilityApi.request('/api/availability/check', 'POST', {
        msp_id: member.id,
        date: formatDate(date)
      });
    }
  });
};
```

---

## Troubleshooting API Integration

### Issue: "TypeError: Cannot read property 'members' of undefined"

**Cause:** API returned wrong format

**Solution:**
1. Check browser DevTools → Network → api/members
2. Verify response has `members` array
3. Contact backend if missing

### Issue: "API Error: Unknown error occurred"

**Cause:** Network error or JSON parsing error

**Solution:**
```bash
# Test API manually
curl https://task.moraspirit.com/api/members -v

# Check:
# - Server is running
# - URL is correct
# - Response is valid JSON
```

### Issue: Availability check doesn't trigger

**Cause:** Missing member or date selection

**Solution:**
1. Ensure member is selected (highlighted in yellow)
2. Ensure date is selected
3. Check browser console for errors

### Issue: CORS error in browser

**Cause:** Backend doesn't allow requests from frontend domain

**Solution:**
1. Get your frontend URL
2. Ask backend team to add it to CORS allowed origins
3. Wait for backend deployment

---

## Deployment Considerations

### Setting API URL in Production

**Vercel:**
1. Go to dashboard → Project Settings
2. Environment Variables
3. Add: `NEXT_PUBLIC_API_URL=https://api.task.moraspirit.com`
4. Redeploy

**Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add: `NEXT_PUBLIC_API_URL=https://api.task.moraspirit.com`
3. Redeploy

**GitHub Pages:**
```bash
# Build with API URL set
NEXT_PUBLIC_API_URL=https://api.task.moraspirit.com npm run build
```

### API Must Be HTTPS in Production

- ✅ `https://api.task.moraspirit.com`
- ❌ `http://api.task.moraspirit.com` (blocked by browsers)
- ❌ `http://localhost:5000` (only for development)

---

## Future Enhancements

- [ ] Request caching with React Query
- [ ] Bulk availability check (multiple members)
- [ ] API request retry logic
- [ ] Request timeout handling
- [ ] API rate limiting awareness
- [ ] GraphQL support (if backend adds it)
- [ ] WebSocket for real-time updates
