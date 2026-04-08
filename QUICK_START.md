# Quick Start Guide

Get the MoraSpirit | Members up and running in **5 minutes**.

---

## 1. Install Dependencies (1 minute)

```bash
# Navigate to project directory
cd ms-dashboard

# Install all packages
npm install
```

---

## 2. Configure API URL (1 minute)

```bash
# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and set your API endpoint
# NEXT_PUBLIC_API_URL=https://task.moraspirit.com
```

For local development with a backend on `http://localhost:5000`:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 3. Start Development Server (1 minute)

```bash
npm run dev
```

**Output:**
```
> ms-dashboard@1.0.0 dev
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Compiled /app/layout successfully
✓ Compiled /app/page successfully
```

**Open in browser:** http://localhost:3000

---

## 4. Verification Checklist (2 minutes)

- [ ] Dashboard loads without errors
- [ ] Members list appears in grid
- [ ] Click on a member to select (yellow border appears)
- [ ] Date picker appears below members
- [ ] Select a date
- [ ] Availability status shows (green/red indicator)

---

## Development Workflow

### Making Changes

**Edit a component:**
```bash
# Edit src/components/MemberList.tsx
# Changes apply automatically (Hot Module Replacement)
```

**Add new dependencies:**
```bash
npm install package-name
# Restart dev server: Ctrl+C, then npm run dev
```

**Build for production:**
```bash
npm run build
# Creates optimized production build in .next directory
```

### Debugging

**Browser DevTools (F12):**
- Console: Error messages
- Network: API requests and responses
- Components: React component tree (if React DevTools installed)

**VS Code Debugging:**
```bash
# Launch.json configuration for vs code
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Common Tasks

### Check API Response

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Click on `/api/members` request
5. Go to "Preview" or "Response" tab to see JSON

### Test with Mock Data

Temporarily modify `hooks/useApi.ts`:

```typescript
// For testing without backend
export function useApi<T>() {
  const request = useCallback(async (endpoint: string) => {
    // Mock response
    if (endpoint === '/api/members') {
      return {
        count: 2,
        members: [
          { id: 'M1', name: 'Jane Doe', role: 'Developer' },
          { id: 'M2', name: 'John Smith', role: 'Designer' }
        ]
      } as T;
    }
  }, []);

  return { data: null, loading: false, error: null, request };
}
```

### Debug Component Rendering

Add console logs:

```typescript
// components/Dashboard.tsx
useEffect(() => {
  console.log('Members loaded:', members);
  console.log('Selected member:', selectedMemberId);
}, [members, selectedMemberId]);
```

---

## Environment-Specific Configuration

### Development

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Usage:**
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Staging

```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://api-staging.task.moraspirit.com
```

**Build:**
```bash
# Vercel automatically loads staging env vars
# Or manually: NEXT_PUBLIC_API_URL=... npm run build
```

### Production

```bash
# Set on hosting platform (Vercel/Netlify)
NEXT_PUBLIC_API_URL=https://api.task.moraspirit.com
```

---

## Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| "Cannot find module" | `npm install` |
| Changes not reflecting | Restart: `Ctrl+C` → `npm run dev` |
| API returns 404 | Check `NEXT_PUBLIC_API_URL` in `.env.local` |
| Styling looks wrong | Run `npm run build` and restart |
| Port 3000 already in use | `npm run dev -- -p 3001` (use different port) |

---

## Next Steps

1. **Review architecture:** Read [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md)
2. **Component details:** Read [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md)
3. **API integration:** Read [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
4. **Deploy:** See "Deployment" section in SETUP_AND_DEPLOYMENT.md

---

## File Structure Quickref

```
ms-dashboard/
├── app/                    # Next.js pages and layout
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root HTML layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Main component
│   ├── MemberList.tsx     # Members grid
│   ├── MemberCard.tsx     # Single member card
│   ├── DateSelector.tsx   # Date input
│   ├── AvailabilityStatus.tsx # Status display
│   ├── Header.tsx         # App header
│   ├── LoadingSpinner.tsx
│   └── ErrorAlert.tsx
├── hooks/                 # Custom React hooks
│   └── useApi.ts         # API calling hook
├── types/                # TypeScript types
│   └── index.ts          # API type definitions
├── package.json          # Dependencies
├── .env.local            # Environment variables (create from .env.local.example)
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config
└── README.md             # This file
```

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint code
npm run lint
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Need Help?

1. Check the troubleshooting section above
2. Review [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for API issues
3. Review [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md) for component details
4. Check browser console (F12 → Console) for error messages
5. Check browser Network tab (F12 → Network) for API issues
