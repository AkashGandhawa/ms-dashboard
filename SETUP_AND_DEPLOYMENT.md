# MoraSpirit | Members - Setup & Deployment Guide

## Project Overview

A modern, responsive Next.js frontend dashboard for checking member availability in real-time. The application features a dark theme with red and yellow accents, comprehensive error handling, and accessibility-first design.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Configuration](#configuration)
5. [Development](#development)
6. [Deployment](#deployment)
7. [Architecture Decisions](#architecture-decisions)

---

## Project Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   cd ms-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   
   # Edit .env.local and set your API URL
   # NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
   ```

4. **Verify installation:**
   ```bash
   npm run build
   ```

---

## Component Architecture

### Directory Structure

```
ms-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Main page component
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── Dashboard.tsx            # Main orchestrator component
│   ├── Header.tsx               # Navigation header
│   ├── MemberList.tsx           # Member list with grid
│   ├── MemberCard.tsx           # Individual member card
│   ├── DateSelector.tsx         # Date input component
│   ├── AvailabilityStatus.tsx   # Status display with indicators
│   ├── LoadingSpinner.tsx       # Loading animation
│   └── ErrorAlert.tsx           # Error message display
├── hooks/                       # Custom React hooks
│   └── useApi.ts               # Reusable API calling hook
├── types/                       # TypeScript type definitions
│   └── index.ts                # API types and interfaces
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
└── next.config.js              # Next.js config
```

### Component Breakdown

#### **Dashboard.tsx** (Main Orchestrator)
- **Purpose:** Central component managing application state and data flow
- **Key Features:**
  - Manages member selection and date state
  - Coordinates API calls for both member list and availability check
  - Displays conditional sections based on user selection
  - Handles error dismissal

#### **MemberList.tsx & MemberCard.tsx** (Member Display)
- **Purpose:** Display organization members and handle selection
- **Design Choice - Card Layout:**
  - ✅ **Information Density:** Shows ID, name, and role together
  - ✅ **Responsive Grid:** Auto-wraps on different screen sizes (1 col mobile, 2 col tablet, 3 col desktop)
  - ✅ **Clear Feedback:** Yellow border and highlight indicate selection
  - ✅ **Accessibility:** Larger touch targets for mobile users
  - ✅ **Scalability:** Easy to add badges, status indicators, or action buttons
- **Accessibility Features:**
  - Keyboard navigation support (Tab, Enter, Space)
  - ARIA labels for screen readers
  - Focus indicators with visible outlines

#### **DateSelector.tsx**
- **Purpose:** Allow users to select a date for availability check
- **Features:**
  - Minimum date set to today (prevents selecting past dates)
  - Auto-fills today's date on first load
  - Real-time display of selected date
  - Native HTML5 date input for better mobile UX

#### **AvailabilityStatus.tsx**
- **Purpose:** Display member availability status and reason
- **Features:**
  - Green indicator for available members
  - Red indicator for busy members
  - Conditional reason display for busy members
  - Loading and error states
  - Color-coded background for quick visual recognition

#### **Header.tsx**
- **Purpose:** Application branding and navigation
- **Features:** Logo area, title, subtitle

#### **Utility Components:**
- **LoadingSpinner.tsx:** Animated loading indicator with yellow/red gradient
- **ErrorAlert.tsx:** Dismissible error messages with clear hierarchy

---

## State Management

### Architecture

The application uses **React Hooks** for state management - a lightweight approach suitable for this use case:

```typescript
// Dashboard.tsx - State Management Pattern
const [members, setMembers] = useState<Member[]>([]);
const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [dismissedError, setDismissedError] = useState(false);

// Custom hook for API calls
const membersApi = useApi<MembersListResponse>();
const availabilityApi = useApi<AvailabilityCheckResponse>();
```

### Data Flow

```
User Interaction
      ↓
Component State Update
      ↓
useApi Hook Triggers Fetch
      ↓
API Request
      ↓
Response Handling
      ↓
Component Re-renders
```

### useApi Hook (`hooks/useApi.ts`)

```typescript
interface UseApiState<T> {
  data: T | null;           // API response data
  loading: boolean;         // Loading indicator
  error: ApiError | null;   // Error object
}

// Usage:
const { data, loading, error, request } = useApi<ResponseType>();
await request('/endpoint', 'POST', payload);
```

**Benefits:**
- Type-safe API calls with TypeScript generics
- Unified error handling
- Reusable across components
- Automatic state management (loading, data, error)

---

## Configuration

### Environment Variables

Create `.env.local` file in the root directory:

```bash
# Copy from example
cp .env.local.example .env.local
```

**Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g., https://task.moraspirit.com)
  - Must be public (NEXT_PUBLIC_) because it's used in browser code
  - Default: https://task.moraspirit.com

### Tailwind CSS Theming

Edit `tailwind.config.ts` for custom colors:

```typescript
colors: {
  'primary': '#1a1a1a',        // Dark background
  'secondary': '#2d2d2d',      // Lighter dark
  'accent-red': '#ef4444',     // Red accent
  'accent-yellow': '#d97706',  // Yellow accent
}
```

---

## Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Production Preview

```bash
npm run build && npm start
```

### Code Quality

```bash
# Lint the code
npm run lint
```

---

## Deployment

### Option 1: Vercel (Recommended)

**Easiest for Next.js apps - deployed directly from repository**

#### Steps:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Configure environment variables:
     - Add `NEXT_PUBLIC_API_URL` with your API endpoint
   - Click **"Deploy"**

3. **Custom Domain (Optional):**
   - In Vercel dashboard → Settings → Domains
   - Add your domain and follow DNS configuration

#### Preview URLs:
- Main deployment: `https://your-project.vercel.app`
- Staging: Auto-generated for pull requests

#### Redeployment:
- Automatic on new commits to main branch
- Manual redeploy via Vercel dashboard

### Option 2: Netlify

**Alternative with git-based deployment**

#### Steps:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click **"New site from Git"**
   - Select GitHub and authorize
   - Choose your repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: https://your-api.com
   - Click **"Deploy"**

3. **Configuration:**
   - Create `netlify.toml` in root:
     ```toml
     [build]
     command = "npm run build"
     publish = ".next"
     
     [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
     ```

4. **Custom Domain:**
   - Netlify → Site settings → Domain management
   - Add custom domain

#### Auto-deployment:
- Automatic on push to main branch

### Option 3: GitHub Pages

**Free but requires static export (Limited Next.js features)**

#### Steps:

1. **Configure Next.js for static export:**
   Edit `next.config.js`:
   ```javascript
   const nextConfig = {
     output: 'export',
     reactStrictMode: true,
   };
   module.exports = nextConfig;
   ```

2. **Add GitHub Actions workflow:**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Build and Deploy
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

3. **Enable GitHub Pages:**
   - Repository → Settings → Pages
   - Select `gh-pages` branch as source
   - Save

4. **Access your site:**
   - `https://your-username.github.io/ms-dashboard`

#### Limitations:
- API calls must handle CORS properly
- No Node.js server-side features
- Slower static generation on large projects

---

## Architecture Decisions

### 1. **Why Next.js?**
- Built-in API integration support
- Automatic code splitting for performance
- Image optimization
- SEO-friendly (metadata API)
- Excellent TypeScript support
- Vercel integration for easy deployment

### 2. **Why Tailwind CSS?**
- Utility-first for rapid styling
- Dark theme built-in support
- Responsive design helpers (lg:, md:, sm:)
- Smaller bundle size than traditional CSS frameworks
- Easy custom color extensions

### 3. **Why React Hooks over Redux?**
- **Hooks are sufficient** for this application's state:
  - Simple data model (members, selected member, date, status)
  - No complex nested state
  - No need for time-travel debugging
- **Benefits:**
  - Reduced bundle size (no Redux library)
  - Simpler mental model
  - Easier to test
- **When to migrate to Redux/Context:**
  - Adding multiple independent API sources
  - Complex state transformations
  - Multiple components need same data at different levels

### 4. **Custom useApi Hook**
- **Replaces** fetch boilerplate
- **Provides:**
  - Type-safe async operations
  - Automatic state management
  - Unified error handling
- **Alternative:** React Query (overkill for 2 endpoints)

### 5. **Component Hierarchy**
```
App (page.tsx)
└── Dashboard (orchestrator)
    ├── Header
    ├── MemberList
    │   └── MemberCard (multiple)
    ├── DateSelector
    └── AvailabilityStatus
```
- **Single Responsibility:** Each component does one thing
- **Unidirectional Data Flow:** Data flows down, events bubble up
- **Easy Testing:** Components are isolated and testable

### 6. **Layout Choice: Cards over Grid**

| Aspect | Cards | Grid |
|--------|-------|------|
| Information | Dense - shows name, role, ID | Sparse - shows one item type |
| Selection | Clear highlight with border | Requires selection overlay |
| Responsive | Natural wrapping | Requires complex media queries |
| Future Features | Easy to add badges/buttons | Limited space |
| **Chosen** | ✅ YES | ❌ NO |

---

## Error Handling

### Levels of Error Handling

1. **API Level** (`hooks/useApi.ts`)
   - Network errors
   - Invalid JSON responses
   - Non-200 status codes

2. **Component Level** (`components/Dashboard.tsx`)
   - Missing required data
   - Invalid selections
   - Concurrent request handling

3. **UI Level**
   - Error alerts with dismiss buttons
   - Fallback UI states
   - Loading placeholders

### Example Error Flow

```typescript
try {
  const response = await membersApi.request('/api/members', 'GET');
} catch (error) {
  // Error is caught and stored in membersApi.error
  // Component renders ErrorAlert with error.message
}
```

---

## Performance Optimizations

1. **Image Optimization:** Tailwind's flex/grid over heavy images
2. **Code Splitting:** Next.js automatic route-based splitting
3. **CSS-in-JS:** Tailwind generates only used classes
4. **API Caching:** Implement if backend supports cache headers
5. **Lazy Loading:** Next.js Image component (if using images in future)

---

## Accessibility Features

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ ARIA labels on interactive elements
- ✅ Semantic HTML (proper heading hierarchy)
- ✅ Color contrast ratios meet WCAG AA
- ✅ Focus indicators visible
- ✅ Form labels associated with inputs

---

## Troubleshooting

### API Connection Issues

**Problem:** "Failed to fetch" error

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify backend API is running
3. Check CORS headers from backend
4. Use browser DevTools Network tab to inspect requests

### Build Errors

**Problem:** TypeScript errors during build

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Environment Variable Not Loading

**Problem:** API URL undefined

**Solution:**
- Variables must be prefixed with `NEXT_PUBLIC_` to be accessible in browser
- Restart dev server after changing `.env.local`
- Check `.env.local` file exists in root (not `./app` or `./public`)

---

## Future Enhancements

- [ ] Add member search/filter
- [ ] Bulk availability check
- [ ] Calendar view for availability
- [ ] Export availability reports
- [ ] User authentication
- [ ] Role-based access control
- [ ] Member profile details view
- [ ] API response caching
- [ ] Offline support (PWA)

---

## License

MIT

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component documentation in their JSDoc comments
3. Check API endpoint responses in browser DevTools
