# Setup & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd d:\Challenge1VS
npm install
```

### 2. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to: http://localhost:3000

The app will automatically redirect to the dashboard.

---

## Complete Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git (optional)

### Step-by-Step Setup

#### 1. **Navigate to Project Directory**
```bash
cd d:\Challenge1VS
```

#### 2. **Install Dependencies**
```bash
npm install
```

This installs all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- Zustand
- Recharts
- Lucide React
- And more...

#### 3. **Initialize Database**

The database is SQLite, which is stored locally in `prisma/dev.db`.

```bash
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate
```

#### 4. **Run Development Server**
```bash
npm run dev
```

Output will show:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env.local
```

#### 5. **Access the Application**
Open browser and go to: **http://localhost:3000**

The app redirects to `/dashboard` automatically.

---

## Using the Application

### First Time Setup

#### Create Master Data

1. **Create Employees First** (required for assignments)
   - Go to Assets page (you can add from there too)
   - But it's better to create employees first
   - Menu → Assets → See if there's employee creation link

   Actually, let me clarify - we need to add the employee management UI or do it via API.

2. **Add Some Sample Assets**
   - Navigate to Assets page
   - Click "Add Asset"
   - Fill in details:
     - Device Type: Laptop
     - Brand: Dell
     - Model: XPS 13
     - Serial Number: ABC123
     - Purchase Date: Recent date
     - Condition: Good
   - Click "Create Asset"

3. **Create Assignments**
   - Navigate to Assignments page
   - Click "New Assignment"
   - Select asset and employee
   - Click "Assign Asset"

4. **View Reports**
   - Navigate to Reports
   - Select report type
   - Click "Generate Report"
   - Export to CSV if needed

5. **Check Audit Log**
   - Navigate to Audit Log
   - See all actions performed

### Dashboard Features

- **Key Metrics**: Total assets, assigned, available, damaged
- **Employee Count**: Total employees in system
- **Asset Utilization**: Percentage of assets in use
- **Charts**: Device type distribution, department distribution, status overview

### Offline Usage

1. **Load the app while online**
   - Navigate to all pages to cache them
   - This caches static assets and API responses

2. **Go offline**
   - Disable internet or open DevTools → Network → Offline
   - App continues to work
   - Uses cached data from IndexedDB

3. **Create/Edit data offline**
   - Changes are saved locally to IndexedDB
   - When back online, syncs with server (auto-implemented in API client)

4. **Install as PWA (Optional)**
   - Click install icon in browser address bar
   - Or use mobile menu to "Add to Home Screen"
   - Run as standalone app

---

## Database Management

### View/Edit Database (GUI)
```bash
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555
- Visual database browser
- Add/edit/delete records
- Great for development

### Common Database Tasks

#### Reset Database (Remove All Data)
```bash
# Delete database file
rm prisma/dev.db

# Recreate with fresh schema
npm run prisma:migrate
```

#### Add Sample Data
```bash
# Via Prisma Studio
npm run prisma:studio

# Then add records through the UI
```

Or create a `prisma/seed.ts` file for automated seed data.

---

## Building for Production

### Build Optimized Version
```bash
npm run build
npm start
```

This creates a production-ready build in `.next/` directory.

### Build with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t airtel-inventory .
docker run -p 3000:3000 airtel-inventory
```

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Follow prompts to deploy. Vercel auto-configures Next.js.

### Deploy to Other Services

**Netlify:**
- Set build command: `npm run build`
- Set publish directory: `.next`
- Add environment variables in dashboard

**Heroku:**
```bash
heroku create airtel-inventory
git push heroku main
```

**AWS, Azure, GCP, etc:**
- Deploy Docker container
- Set DATABASE_URL environment variable
- Ensure SQLite persistence (if using SQLite) or use PostgreSQL

---

## Environment Variables

### `.env.local` (Already Created)
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="Airtel Asset Inventory"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Production `.env` (Example)
```
DATABASE_URL="postgresql://user:password@host/database"
NEXT_PUBLIC_APP_URL="https://inventory.airtel.com"
NODE_ENV="production"
```

### Change Database (SQLite to PostgreSQL)

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update environment variable:
```
DATABASE_URL="postgresql://user:password@localhost:5432/airtel_inventory"
```

3. Migrate:
```bash
npm run prisma:migrate
```

---

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Issue: Database migration fails

**Solution:**
```bash
# Remove existing database
rm prisma/dev.db

# Regenerate Prisma client
npm run prisma:generate

# Run migration fresh
npm run prisma:migrate
```

### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript types
npm run prisma:generate

# Restart dev server
# Ctrl+C then npm run dev
```

### Issue: Service Worker not registering

**Solution:**
- Check browser console for errors
- Ensure accessing over localhost or HTTPS (SW requires secure context)
- Clear browser cache and reload
- Check `public/service-worker.js` is present

### Issue: Offline mode not working

**Solution:**
1. Ensure Service Worker is registered (check DevTools → Application)
2. Load pages while online to cache them
3. Open DevTools → Network → select "Offline" from dropdown
4. Reload page - should still work

### Issue: Dark mode not persisting

**Solution:**
- Clear browser localStorage: `localStorage.clear()`
- Reload page
- Toggle dark mode again

---

## Development Workflow

### Adding a New Feature

#### 1. Database Model
Update `prisma/schema.prisma`:
```prisma
model NewModel {
  id    String @id @default(cuid())
  name  String
  // ... other fields
}
```

#### 2. Run Migration
```bash
npm run prisma:migrate
```

#### 3. Create API Route
Create `app/api/newfeature/route.ts`:
```typescript
export async function GET(request) {
  // Handle GET request
}

export async function POST(request) {
  // Handle POST request
}
```

#### 4. Add State Management
Update `store/newStore.ts`:
```typescript
import { create } from 'zustand';

export const useNewStore = create((set) => ({
  // State and actions
}));
```

#### 5. Create UI Component
Create `components/NewComponent.tsx`:
```typescript
export function NewComponent() {
  // Component logic
  return <div>// JSX</div>;
}
```

#### 6. Create Page
Create `app/newfeature/page.tsx`:
```typescript
'use client';
export default function NewPage() {
  return <div>// Page content</div>;
}
```

#### 7. Add Navigation
Update `components/Sidebar.tsx` menu items.

### Code Style Guide

- **TypeScript**: Always use strict mode
- **Components**: Use functional components with hooks
- **Naming**: 
  - Components: PascalCase
  - Functions/variables: camelCase
  - Files: kebab-case for pages, PascalCase for components
- **Styling**: Tailwind CSS classes, reserve CSS modules for complex styles
- **Comments**: Add comments for complex logic
- **Testing**: Add unit tests for utilities, integration tests for API

---

## Performance Monitoring

### Development
```bash
npm run dev
# Open DevTools → Performance tab
# Record user interactions
# Analyze performance metrics
```

### Production Build Analysis
```bash
npm run build
# Shows bundle size information
```

### Chrome DevTools
- Performance tab: Record and analyze page load
- Lighthouse tab: Run automated audits
- Network tab: Check asset loading and caching
- Application tab: View Service Worker, Cache Storage, IndexedDB

---

## Maintenance

### Regular Tasks

#### Weekly
- Check audit logs for issues
- Review error logs (if logging implemented)
- Verify backups are working

#### Monthly
- Update dependencies: `npm update`
- Review and optimize slow queries
- Check disk usage for database

#### Quarterly
- Major dependency updates
- Security audit
- Performance profiling
- User feedback review

### Backup Strategy

For production SQLite:
```bash
# Backup database
cp prisma/dev.db prisma/backup/dev.db.$(date +%Y%m%d)
```

For production PostgreSQL:
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## Support & Documentation

### Getting Help

1. **Built-in Help**
   - Hover over fields for tooltips
   - Check README.md for feature documentation

2. **Developer Tools**
   - Prisma Studio: `npm run prisma:studio`
   - Next.js DevTools
   - Browser DevTools

3. **External Resources**
   - Next.js Docs: https://nextjs.org/docs
   - Prisma Docs: https://www.prisma.io/docs
   - Tailwind Docs: https://tailwindcss.com/docs
   - React Docs: https://react.dev

### Reporting Issues

If you encounter bugs:
1. Note the exact steps to reproduce
2. Screenshot or error message
3. Browser and device information
4. Check browser console for errors
5. Report to development team

---

## Security Checklist

For production deployment, ensure:

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials not in code
- [ ] Input validation on all API routes
- [ ] Output sanitization to prevent XSS
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Authentication added
- [ ] Authorization checks in place
- [ ] Error messages don't expose sensitive info
- [ ] Logging and monitoring enabled
- [ ] Regular security updates scheduled

---

## Next Steps

1. ✅ Start development server
2. ✅ Explore the UI
3. ✅ Add sample data
4. ✅ Test offline mode
5. ✅ Customize branding (logos, colors)
6. ✅ Add authentication
7. ✅ Setup production database
8. ✅ Deploy to hosting service
9. ✅ Monitor and maintain

---

**Happy developing! 🚀**
