# Pre-Deployment Checklist

Complete this checklist before deploying your MoraSpirit | Members to production.

---

## Development Setup ✓

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server runs without errors (`npm run dev`)
- [ ] No console errors in browser (F12 → Console)
- [ ] `.env.local` file created with `NEXT_PUBLIC_API_URL`

---

## Code Quality ✓

### TypeScript & Linting
- [ ] No TypeScript compilation errors (`npm run build`)
- [ ] Code follows ESLint rules (`npm run lint`)
- [ ] All imports are properly typed
- [ ] No `any` types without justification
- [ ] Type definitions match API responses

### Component Quality
- [ ] All components have clear responsibility
- [ ] Props are typed with interfaces
- [ ] No prop drilling (data at wrong levels)
- [ ] Components are testable

### State Management
- [ ] State updates are intentional
- [ ] No unnecessary re-renders
- [ ] Loading states properly handled
- [ ] Error states have User-friendly messages
- [ ] State cleanup in useEffect dependencies

---

## API Integration ✓

### Endpoint Testing
- [ ] GET `/api/members` returns correct format
  ```json
  {
    "count": <number>,
    "members": [
      {"id": "...", "name": "...", "role": "..."}
    ]
  }
  ```

- [ ] POST `/api/availability/check` works correctly
  - [ ] Request: `{ msp_id: "M1", date: "2026-04-08" }`
  - [ ] Response (available): `{ ... status: "available" }`
  - [ ] Response (busy): `{ ... status: "busy", reason: "..." }`

- [ ] CORS headers present or configured
  - [ ] `Access-Control-Allow-Origin` includes your domain
  - [ ] Methods: GET, POST allowed
  - [ ] Headers: Content-Type allowed

### Error Handling
- [ ] Network errors gracefully handled
- [ ] Invalid responses show error alerts
- [ ] Missing fields don't crash app
- [ ] Error messages are helpful
- [ ] Users can dismiss error alerts

### Development API Testing
- [ ] Test with local backend: `NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev`
- [ ] Test with staging API: `NEXT_PUBLIC_API_URL=https://api-staging.task.moraspirit.com npm run dev`
- [ ] Browser DevTools Network tab shows clean requests
- [ ] No CORS errors in console

---

## UI/UX ✓

### Responsive Design
- [ ] Mobile (360px): Single column layout works
- [ ] Tablet (768px): Two column layout works
- [ ] Desktop (1024px+): Three column layout works
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets ≥ 44x44px for mobile

### Dark Theme & Colors
- [ ] Dark background loads correctly
- [ ] Text contrast is readable
- [ ] Yellow accent highlights visible
- [ ] Red accent for errors visible
- [ ] No white text on light backgrounds

### Interactive Elements
- [ ] Member cards highlight on hover
- [ ] Selected member shows yellow border
- [ ] Date picker works on mobile/desktop
- [ ] Loading spinners animate smoothly
- [ ] Buttons are clickable
- [ ] Links understandable

### Content
- [ ] Member names display correctly
- [ ] Roles are readable
- [ ] IDs are visible
- [ ] Status messages are clear
- [ ] No garbled/truncated text

---

## Accessibility ✓

### Keyboard Navigation
- [ ] Tab key navigates through members
- [ ] Enter/Space selects member cards
- [ ] Date input works with keyboard
- [ ] Error dismissal button accessible
- [ ] Tab focus visible throughout

### Screen Readers
- [ ] Page title is descriptive
- [ ] ARIA labels on interactive elements
- [ ] Images have alt text (if any)
- [ ] Headings in proper hierarchy (h1, h2, h3...)
- [ ] Form labels associated with inputs

### Visual Accessibility
- [ ] Text color contrast ratio ≥ 4.5:1
- [ ] Don't rely on color alone (use icons + color)
- [ ] Focus indicators clearly visible
- [ ] Text is resizable (no fixed px sizes only)

### Semantic HTML
- [ ] Using `<button>` for buttons (not divs)
- [ ] Using `<label>` for form labels
- [ ] Using `aria-pressed` for toggle buttons
- [ ] Using `<section>` for major sections
- [ ] Using semantic headings

---

## Performance ✓

### Bundle Size
- [ ] Production build created (`npm run build`)
- [ ] Build output < 500KB (with Next.js overhead)
- [ ] No duplicate dependencies
- [ ] Tree-shaking working (check `.next/static`)

### Load Time
- [ ] First Contentful Paint (FCP) < 2s
- [ ] Largest Contentful Paint (LCP) < 3s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] No long JavaScript execution blocks

### Runtime Performance
- [ ] Member list renders quickly (< 500ms)
- [ ] API calls don't block UI
- [ ] Scrolling smooth on member grid
- [ ] No memory leaks (check DevTools)
- [ ] No console warnings

### Images & Assets
- [ ] No 4K images
- [ ] Images are compressed
- [ ] Using CSS gradients instead of images (where applicable)
- [ ] No unused CSS files

---

## Error Scenarios ✓

### Network Issues
- [ ] App handles offline gracefully
- [ ] Timeout errors show message
- [ ] Retry logic works (if implemented)
- [ ] Error message doesn't expose internal details

### Backend Failures
- [ ] 404 Not Found: Shows friendly message
- [ ] 500 Server Error: Shows friendly message
- [ ] Invalid JSON: Shows friendly message
- [ ] No members returned: Shows "No members found"

### User Input Issues
- [ ] Entering invalid date shows message
- [ ] Selecting past date blocked
- [ ] Rapid member selection doesn't break
- [ ] Concurrent requests handled correctly

### Browser Compatibility
- [ ] Desktop: Chrome, Firefox, Safari, Edge
- [ ] Mobile: Chrome, Safari (iOS)
- [ ] TypeScript types work in all browsers
- [ ] CSS doesn't require polyfills

---

## Security ✓

### Input Handling
- [ ] User input never directly rendered (XSS protection)
- [ ] API URLs constructed safely (no injection)
- [ ] No sensitive data in environment variables (public ones only)
- [ ] No API keys in frontend code

### API Communication
- [ ] All API calls use HTTPS (not HTTP)
- [ ] CORS headers configured properly
- [ ] Request bodies don't leak sensitive data
- [ ] Responses don't contain sensitive data

### Deployment
- [ ] `.env.local` in `.gitignore` (not committed)
- [ ] No secrets in package.json
- [ ] No hardcoded URLs (except fallback)
- [ ] Built files are minified

---

## Documentation ✓

### Code Comments
- [ ] Complex logic has comments
- [ ] Component purposes explained
- [ ] Non-obvious decisions documented
- [ ] Type definitions have JSDoc

### README Files
- [ ] `README.md` is comprehensive
- [ ] `QUICK_START.md` has working steps
- [ ] `SETUP_AND_DEPLOYMENT.md` covers all platforms
- [ ] `COMPONENT_DOCUMENTATION.md` explains details
- [ ] `API_INTEGRATION_GUIDE.md` covers endpoints

### Configuration
- [ ] `.env.local.example` shows available variables
- [ ] Installation instructions are clear
- [ ] Troubleshooting section included
- [ ] Links between docs work correctly

---

## Deployment Preparation ✓

### Vercel
- [ ] GitHub repository created & public
- [ ] `.env.local` NOT in git (use `.env.local.example`)
- [ ] Build command verified: `npm run build`
- [ ] Output directory correct: `.next`
- [ ] `NEXT_PUBLIC_API_URL` ready to add

### Netlify
- [ ] GitHub repository created & public
- [ ] Netlify configuration prepared (or use UI)
- [ ] `netlify.toml` created (optional)
- [ ] Build settings configured in UI
- [ ] Environment variables ready

### GitHub Pages
- [ ] Repository created & public
- [ ] `next.config.js` has `output: 'export'`
- [ ] GitHub Actions workflow created
- [ ] Publish branch set to `gh-pages`
- [ ] Custom domain (optional) ready

### General
- [ ] Domain name ready (if custom)
- [ ] SSL/HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Admin access to hosting platform
- [ ] Backups of configuration (screenshots)

---

## Final Testing ✓

### Full User Journey
- [ ] Page loads without errors
- [ ] Member list displays (≥1 member)
- [ ] Can select multiple members sequentially
- [ ] Date picker shows today by default
- [ ] Cannot select past dates
- [ ] Availability check triggers on date change
- [ ] Green indicator appears for available members
- [ ] Red indicator + reason appears for busy members
- [ ] Can change date and re-check same member
- [ ] Error dismissal works
- [ ] No console errors throughout

### Cross-Device
- [ ] Mobile (360px): Fully functional
- [ ] Tablet (768px): Fully functional
- [ ] Desktop (1024px): Fully functional
- [ ] Touch navigation works on mobile
- [ ] No UI overlaps or missing elements

### Multiple Browsers
- [ ] Chrome: Works perfectly
- [ ] Firefox: Works perfectly
- [ ] Safari: Works perfectly
- [ ] Edge: Works perfectly

### Data Integrity
- [ ] Member names display correctly
- [ ] Roles display correctly
- [ ] Dates format consistently
- [ ] Status is accurate (available/busy)
- [ ] Reasons display for busy members

---

## Production Deployment ✓

### Pre-Launch
- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Review all environment variables
- [ ] Verify API endpoint is production-ready
- [ ] Backup current state
- [ ] Test one more time in staging

### Launch
- [ ] Deploy to chosen platform
- [ ] Wait for build to complete
- [ ] Verify deployment successful (no errors)
- [ ] Test deployed URL in browser
- [ ] Check all API calls work
- [ ] Verify error handling works

### Post-Launch
- [ ] Monitor error logs (Vercel/Netlify dashboard)
- [ ] Check browser console for errors
- [ ] Verify API requests in Network tab
- [ ] Test from multiple locations/networks
- [ ] Get feedback from team members

---

## Rollback Plan ✓

If something goes wrong after deployment:

1. **Identify Issue**
   - Check deployment logs
   - Monitor error tracking
   - Reproduce on staging first

2. **Revert Deployment**
   - Previous version usually available in hosting dashboard
   - Redeploy previous commit if needed
   - Or temporarily disable via hosting platform

3. **Fix & Re-deploy**
   - Make fixes locally
   - Test thoroughly on staging
   - Deploy again when ready

---

## Post-Deployment Monitoring ✓

### Daily (First Week)
- [ ] Check error logs
- [ ] Verify API connectivity
- [ ] Test member list loads
- [ ] Test availability checks
- [ ] Monitor browser console for errors

### Weekly
- [ ] Review performance metrics
- [ ] Check for 404/500 errors
- [ ] Verify HTTPS working
- [ ] Test new browser versions if needed
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies if needed
- [ ] Security review
- [ ] Performance optimization
- [ ] Feature enhancement planning
- [ ] Documentation updates

---

## Signoff ✓

**Developer Name:** ___________________
**Date:** ___________________
**Environment:** Development / Staging / Production
**All items checked:** ☐ YES ☐ NO

**Comments/Notes:**
```
_____________________________________________________________________________

_____________________________________________________________________________

_____________________________________________________________________________
```

**Ready for Production:** ☐ YES ☐ NO

If "NO", list blocking issues:
```
1. ___________________________________________________________________________
2. ___________________________________________________________________________
3. ___________________________________________________________________________
```

---

## Quick Verification Script

Run this before final deployment:

```bash
#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║  Member Dashboard Pre-Deployment Check ║"
echo "╚════════════════════════════════════════╝"
echo ""

echo "✓ Checking dependencies..."
npm list > /dev/null 2>&1 && echo "  ✓ Dependencies OK" || echo "  ✗ Dependencies missing"

echo "✓ Checking TypeScript..."
npm run build > /dev/null 2>&1 && echo "  ✓ Build OK" || echo "  ✗ Build failed"

echo "✓ Checking ESLint..."
npm run lint > /dev/null 2>&1 && echo "  ✓ Lint OK" || { echo "  ⚠ Lint warnings"; npm run lint; }

echo "✓ Checking .env.local..."
[ -f .env.local ] && echo "  ✓ .env.local exists" || echo "  ⚠ .env.local missing (use .env.local.example)"

echo "✓ Checking Git status..."
[ -z "$(git status --porcelain)" ] && echo "  ✓ No uncommitted changes" || echo "  ⚠ Uncommitted changes found"

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         Pre-Deployment Check Done      ║"
echo "╚════════════════════════════════════════╝"
```

Save as `pre-deploy.sh` and run: `bash pre-deploy.sh`

---

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Web Vitals Guide](https://web.dev/vitals/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Deployment_Checklist.html)

---

## Support

If issues arise:
1. Check the relevant documentation file
2. Review error messages carefully
3. Check browser DevTools (F12)
4. Test API endpoints manually
5. Check hosting platform logs
