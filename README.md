# MoraSpirit | Members

A modern, responsive Next.js frontend for checking real-time member availability. Built with TypeScript, Tailwind CSS, and a dark theme featuring red and yellow accents.

**Demo Features:**
- ✅ Fetch and display organization members
- ✅ Real-time availability checking via API
- ✅ Responsive card-based layout (Mobile, Tablet, Desktop)
- ✅ Dark theme with red/yellow accent colors
- ✅ Comprehensive error handling
- ✅ Accessibility-first design (WCAG 2.1 AA)
- ✅ Easy deployment to Vercel, Netlify, or GitHub Pages

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API endpoint
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL in .env.local

# 3. Start development server
npm run dev

# Open http://localhost:3000
```

**Full setup guide:** [QUICK_START.md](./QUICK_START.md)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Get running in 5 minutes |
| [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md) | Complete setup + deployment guide |
| [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md) | Detailed component reference |
| [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) | Backend API integration details |

---

## Architecture Overview

### Component Tree

```
App (page.tsx)
└── Dashboard
    ├── Header
    ├── MemberList
    │   └── MemberCard (grid)
    ├── DateSelector
    └── AvailabilityStatus
```

### State Management

React Hooks for optimal simplicity:
- Member list state
- Selected member ID
- Selected date
- Error/loading states
- Custom `useApi` hook for API calls

### Key Features

#### Member List (Card Layout)
- Responsive grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Yellow border highlight when selected
- Shows: Name, Role, Member ID
- **Why cards?** Better information density, responsive wrapping, larger touch targets, extensible

#### Availability Checking
- Select member → Select date → Automatic API check
- Green indicator (✓ Available)
- Red indicator (✗ Busy) with reason display
- Real-time feedback

#### Error Handling
- API error alerts with dismiss option
- Network error recovery
- Graceful fallbacks
- User-friendly error messages

#### Accessibility
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels for screen readers
- Focus indicators
- Semantic HTML
- Color contrast WCAG AA compliant

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 15 | React-based with SSR/SSG |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State Management** | React Hooks | Simple, lightweight |
| **Deployment** | Vercel/Netlify/GitHub Pages | Easy hosting |

---

## Project Structure

```
ms-dashboard/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                    # React components
│   ├── Dashboard.tsx             # Main orchestrator
│   ├── Header.tsx
│   ├── MemberList.tsx & MemberCard.tsx
│   ├── DateSelector.tsx
│   ├── AvailabilityStatus.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorAlert.tsx
├── hooks/                         # Custom hooks
│   └── useApi.ts                 # Reusable API logic
├── types/                         # TypeScript definitions
│   └── index.ts                  # API types
├── package.json                   # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── .env.local.example            # Environment template
└── Documentation files
    ├── README.md (this file)
    ├── QUICK_START.md
    ├── SETUP_AND_DEPLOYMENT.md
    ├── COMPONENT_DOCUMENTATION.md
    └── API_INTEGRATION_GUIDE.md
```

---

## API Endpoints

The application integrates with two backend endpoints:

### 1. Get Members List

```
GET /api/members
Response: { count: 10, members: [{id, name, role}, ...] }
```

### 2. Check Availability

```
POST /api/availability/check
Request: { msp_id: "M1", date: "2026-04-08" }
Response: { id, name, role, status: "available"|"busy", reason? }
```

**Full details:** [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

---

## Styling System

### Color Palette

- **Primary:** `#1a1a1a` - Dark background
- **Secondary:** `#2d2d2d` - Lighter dark
- **Accent Red:** `#ef4444` - Status/alerts
- **Accent Yellow:** `#eab308` - Highlights/selection
- **Gray:** `#9ca3af` → `#f3f4f6` - Text/borders

### Dark Theme Implementation

All components use dark theme:
- `bg-gray-900` - Page background
- `bg-gray-800` - Component backgrounds
- `text-white` - Primary text
- `text-gray-400` - Secondary text

### Responsive Design

Tailwind breakpoints:
- **Mobile:** Default (< 640px)
- **Tablet:** `md:` (≥ 768px)
- **Desktop:** `lg:` (≥ 1024px)

---

## Deployment

### Option 1: Vercel (Recommended)

Easiest path for Next.js:

```bash
# Push to GitHub
git push origin main

# Deploy on vercel.com
# Auto-deploys on every push
# Set NEXT_PUBLIC_API_URL environment variable
```

[Full Vercel setup](./SETUP_AND_DEPLOYMENT.md#option-1-vercel-recommended)

### Option 2: Netlify

Git-based deployment:

```bash
# Connect repository on netlify.com
# Configure build: npm run build
# Publish directory: .next
# Add NEXT_PUBLIC_API_URL environment variable
```

[Full Netlify setup](./SETUP_AND_DEPLOYMENT.md#option-2-netlify)

### Option 3: GitHub Pages

Static export (limited features):

```bash
# Configure next.config.js with output: 'export'
# Push to GitHub
# Setup GitHub Actions workflow
# Deploy from gh-pages branch
```

[Full GitHub Pages setup](./SETUP_AND_DEPLOYMENT.md#option-3-github-pages)

---

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

Create `.env.local` from template:

```bash
cp .env.local.example .env.local
```

**Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL (e.g., https://task.moraspirit.com)

### Development Workflow

1. **Make changes** to components
2. **Hot reload** automatically updates (no refresh needed)
3. **Check browser console** for errors (F12)
4. **Test API** with Network tab in DevTools
5. **Build** to check for TypeScript errors: `npm run build`

---

## Performance

- **Code Splitting:** Automatic route-based splitting
- **CSS:** Only used classes generated by Tailwind
- **API Caching:** Consider React Query for complex scenarios
- **Image Optimization:** Tailwind gradients (no images needed)
- **Bundle Size:** ~50KB (gzipped, without node_modules)

---

## Accessibility (WCAG 2.1 AA)

✅ Keyboard navigation (Tab, Enter, Space)

✅ ARIA labels on interactive elements

✅ Focus indicators visible

✅ Semantic HTML structure

✅ Color contrast ratios: 4.5:1+ (AA compliant)

✅ Screen reader support

---

## Troubleshooting

### Installation Issues

```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### API Connection

1. Verify `NEXT_PUBLIC_API_URL` is set in `.env.local`
2. Check backend is running
3. Test manually: `curl https://task.moraspirit.com/api/members`
4. Check browser console (F12) for errors

### Styling Issues

- Restart dev server after changing Tailwind config
- Clear browser cache (Ctrl+Shift+Del)
- Ensure Tailwind CSS is compiled: `npm run build`

**More troubleshooting:** [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md#troubleshooting)

---

## Architecture Decisions

### Why Next.js?
- Built-in API integration
- Automatic code splitting
- Excellent TypeScript support
- Image optimization
- Easy deployment (Vercel)

### Why Tailwind CSS?
- Rapid styling with utility classes
- Dark theme built-in
- Responsive helpers (breakpoints)
- Smaller bundle size

### Why React Hooks over Redux?
- Simpler state model for this app
- No complex nested state
- Reduced bundle size
- Easier to test and understand

### Why Card Layout over Grid?
- ✅ Information density
- ✅ Natural responsive wrapping
- ✅ Larger touch targets (accessibility)
- ✅ Easy to extend with badges/buttons

---

## Future Enhancements

- [ ] Add member search/filter
- [ ] Bulk availability check
- [ ] Calendar view for availability
- [ ] Export availability reports
- [ ] User authentication
- [ ] Role-based access control
- [ ] API request caching (React Query)
- [ ] Offline support (PWA)

---

## License

MIT - Free to use and modify

---

## Getting Help

1. **Quick questions?** See [QUICK_START.md](./QUICK_START.md)
2. **Component details?** See [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md)
3. **API issues?** See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
4. **Deployment questions?** See [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md)
5. **Code examples?** Check component file JSDoc comments
6. **Browser issues?** Open DevTools (F12) → Console/Network tabs
