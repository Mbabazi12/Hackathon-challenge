# Airtel Asset Inventory Management System

An offline-first, full-stack asset inventory management web application built with Next.js (App Router), TypeScript, and Tailwind CSS. Designed to solve asset tracking challenges in environments with limited or no internet connectivity.

## 🎯 Features

### Core Functionality
- ✅ **Asset Management** - Add, edit, delete, and track all company devices (laptops, desktops, mobile phones)
- ✅ **Assignment Tracking** - Assign devices to employees and track returns
- ✅ **Condition Monitoring** - Update device conditions with history tracking
- ✅ **Issue & Return Management** - Log asset issuance and returns with timestamps
- ✅ **Search & Filtering** - Filter by asset ID, employee, device type, department, status
- ✅ **Reporting** - Generate reports by date, department, device type, and status
- ✅ **Audit Trail** - Complete history of all asset movements and updates

### Offline Support
- ✅ **Offline-First** - Application works completely offline
- ✅ **IndexedDB Caching** - Local data persistence for offline mode
- ✅ **Auto-Sync** - Syncs data when connection is restored
- ✅ **Service Worker PWA** - Install as standalone app

### UI/UX
- ✅ **Clean Dashboard** - Overview statistics and charts
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Mode** - Theme toggle support
- ✅ **Pagination** - Efficient data handling with pagination
- ✅ **Modal Forms** - Smooth form interactions

<!-- ## 📁 Project Structure

```
├── app/
│   ├── api/                      # API routes
│   │   ├── assets/              # Asset CRUD endpoints
│   │   ├── employees/           # Employee management endpoints
│   │   ├── assignments/         # Assignment management endpoints
│   │   ├── dashboard/           # Dashboard statistics
│   │   ├── reports/             # Report generation
│   │   └── audit-logs/          # Audit log endpoints
│   ├── assets/                  # Assets page
│   ├── assignments/             # Assignments page
│   ├── audit/                   # Audit logs page
│   ├── dashboard/               # Dashboard page
│   ├── reports/                 # Reports page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── page.tsx                 # Home page (redirect to dashboard)
├── components/                  # Reusable React components
│   ├── AppInitializer.tsx      # App initialization (Service Worker, IndexedDB)
│   ├── AssetForm.tsx           # Asset creation/editing form
│   ├── AssignmentForm.tsx      # Assignment form
│   ├── Button.tsx              # Button component
│   ├── Card.tsx                # Card component
│   ├── Modal.tsx               # Modal dialog component
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── Table.tsx               # Data table component
├── lib/
│   ├── api-client.ts           # API client with offline support
│   ├── indexedDB.ts            # IndexedDB utilities
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   ├── service-worker.js       # Service worker for PWA
│   └── manifest.json           # PWA manifest
├── store/                       # Zustand state management stores
│   ├── assetStore.ts           # Asset state
│   ├── assignmentStore.ts      # Assignment state
│   ├── employeeStore.ts        # Employee state
│   └── uiStore.ts              # UI state (dark mode, modals, etc)
├── types/                       # TypeScript type definitions
│   └── index.ts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── next.config.js              # Next.js configuration
└── README.md                   # This file
``` -->

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- SQLite (included with Prisma)

### Installation

1. **Clone and Navigate**
```bash
cd Challenge1VS
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Database**
```bash
# Generate Prisma client
npm run prisma:generate

# Create and migrate database
npm run prisma:migrate
```

4. **Create Environment File**
```bash
# .env.local is already created, verify it contains:
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_NAME="Airtel Asset Inventory"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will redirect to `/dashboard` by default.

### Build for Production

```bash
npm run build
npm start
```

## 📊 Database Schema

### Models

**Asset**
- Auto-generated unique asset ID
- Device type (laptop, desktop, mobile-phone)
- Brand, model, serial number
- Specifications (JSON)
- Purchase date, condition, status
- Location
- Timestamps

**Employee**
- Employee ID, name, email
- Department, designation, phone
- Timestamps

**Assignment**
- Asset ↔ Employee relationship
- Assignment and return dates
- Status (assigned/returned)
- Notes
- Timestamps

**AuditLog**
- Tracks all asset movements and updates
- Action type (create, update, delete, assign, return)
- Before/after values (JSON)
- Timestamp index for fast queries

**ConditionHistory**
- Tracks condition changes over time
- Previous/new condition
- Change reason
- Timestamp

## 🔌 API Routes

### Assets
- `GET /api/assets` - List assets with filtering
- `POST /api/assets` - Create asset
- `GET /api/assets/:id` - Get asset details
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/:id` - Get assignment details
- `DELETE /api/assignments/:id` - Return asset

### Dashboard & Reports
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/reports` - Generate reports by type
- `GET /api/audit-logs` - Audit log entries

## 🛠️ Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Recharts (Charts & Graphs)
- Lucide React (Icons)

**Backend**
- Next.js API Routes
- Prisma ORM
- SQLite Database

**Offline Support**
- IndexedDB (Local Storage)
- Service Workers (PWA)
- Workbox Window

**Styling**
- Tailwind CSS
- Dark Mode Support

**Utilities**
- Date-fns (Date handling)
- PapaParse (CSV export)

## 📱 PWA Features

The application is a Progressive Web App (PWA) that can be:
- Installed as a standalone app on mobile and desktop
- Accessed offline with cached data
- Uses Service Workers for resource caching
- Includes manifest.json for app metadata

### Install Instructions

**On Android:**
1. Open app in Chrome
2. Tap menu (⋮) → "Install app"

**On iOS:**
1. Open app in Safari
2. Tap Share → "Add to Home Screen"

**On Desktop:**
1. Open app in Chrome
2. Click install icon in address bar

## 🔄 Offline Workflow

1. **Online Mode:**
   - App syncs with server API
   - Caches data in IndexedDB and localStorage
   - Service Worker caches static assets

2. **Offline Mode:**
   - App reads from IndexedDB cache
   - All CRUD operations buffer locally
   - UI remains fully functional

3. **Reconnection:**
   - App detects connection restoration
   - Attempts to sync buffered changes
   - Updates cached data with server responses

## 🎨 Features Breakdown

### Dashboard
- 4 key metric cards (Total, Assigned, Available, Damaged)
- Charts: Assets by device type, by department
- Status distribution visualization

### Assets Management
- Create/edit/delete assets
- Filter by type, status, condition
- Search by asset ID, serial number, or model
- View complete asset history

### Assignments
- Assign devices to employees
- Track assignment dates
- Return devices with one click
- View assignment history

### Reports
- Reports by department, device type, status, condition, date range
- Export reports to CSV
- Real-time statistics

### Audit Log
- Complete history of all actions
- Filter by action type, date range
- See who did what and when
- Track assets and employees involved

## 🔐 Security Considerations

- Data stored in IndexedDB is not encrypted (consider for production)
- All API routes use standard HTTP (add HTTPS in production)
- No authentication implemented (add authentication for production)
- Consider adding role-based access control

## 📈 Performance Optimizations

- Pagination on all list views
- Efficient database queries with indexes
- Service Worker caching strategy
- Image and asset optimization
- Lazy loading of routes

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db

# Recreate database
npm run prisma:migrate
```

### Service Worker Issues
```bash
# Clear browser cache
# Settings → Clear browsing data → Cache, cookies
# Or use DevTools to unregister service worker
```

### Offline Mode Testing
1. Open app
2. Load some pages to cache them
3. Open DevTools → Network tab
4. Select "Offline" from throttling menu
5. Try navigating and performing actions

## 📝 Development Notes

### Adding a New Feature

1. **Database:** Update `prisma/schema.prisma`
2. **Migration:** Run `npm run prisma:migrate`
3. **API:** Create endpoints in `app/api/`
4. **State:** Add to Zustand store in `store/`
5. **UI:** Create components in `components/`
6. **Page:** Create page in `app/[feature]/page.tsx`

### Code Style
- Use TypeScript for type safety
- Components are functional with hooks
- Use Tailwind CSS for styling
- Dark mode support via class strategy
- Use lucide-react for icons

## 🚀 Deployment

### Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)
- Set DATABASE_URL to production database
- Add authentication secrets
- Configure CORS if needed

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## 📄 License

This project is provided as-is for Airtel asset management purposes.

## ✅ Checklist for Production

- [ ] Add authentication and authorization
- [ ] Encrypt sensitive data in IndexedDB
- [ ] Set up backup strategy for database
- [ ] Configure HTTPS
- [ ] Add rate limiting to API routes
- [ ] Implement logging and monitoring
- [ ] Add error tracking (Sentry, etc.)
- [ ] Performance testing and optimization
- [ ] Security audit
- [ ] User documentation
- [ ] Admin panel for system management
- [ ] Bulk import/export functionality
- [ ] Email notifications
- [ ] Mobile app (React Native/Flutter)

## 🤝 Support

For questions or issues, contact the development team or create an issue in the project repository.

---

**Built with ❤️ for Airtel Asset Management**
