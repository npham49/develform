# Laravel to Bun Hono React Migration

This project has been successfully migrated from **Laravel + Inertia.js + React** to **Bun + Hono + React** with TanStack Router and TanStack Query.

## Migration Overview

### Original Stack
- **Backend**: Laravel PHP with Eloquent ORM
- **Frontend**: React with Inertia.js for routing
- **Database**: PostgreSQL with Laravel migrations
- **Authentication**: Laravel Sanctum
- **Styling**: Bootstrap 5

### New Stack
- **Backend**: Bun + Hono TypeScript server
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React with TanStack Router
- **Data Fetching**: TanStack Query
- **Authentication**: JWT tokens
- **Styling**: Bootstrap 5 (preserved)

## Architecture Changes

### Backend (Laravel → Hono)
```
Laravel Structure          →    Hono Structure
├── app/Http/Controllers/  →    server/controllers/
├── app/Models/           →    Prisma models
├── app/Http/Middleware/  →    server/middleware/
├── routes/web.php        →    server/routes/
├── database/migrations/  →    prisma/schema.prisma
└── .env                  →    .env.hono
```

### Frontend (Inertia → TanStack)
```
Inertia Structure         →    TanStack Structure
├── resources/js/app.tsx  →    resources/js/app-hono.tsx
├── pages/{page}.tsx      →    pages/{page}-hono.tsx
├── Inertia routing       →    resources/js/routes/
├── usePage() hooks       →    TanStack Query hooks
└── Link components       →    TanStack Router Link
```

## Key Components Migrated

### Models (1:1 Laravel → Prisma)
- **User**: Authentication and user management
- **Form**: Form definitions and schema
- **Submission**: Form submission data
- **SubmissionToken**: Secure submission access tokens

### Controllers (1:1 Laravel → Hono)
- **AuthController**: Registration, login, logout, user profile
- **FormController**: CRUD operations for forms
- **SubmissionController**: Handling form submissions and responses

### Pages (UI preserved, data layer updated)
- **Dashboard**: Overview of forms and submissions
- **Forms Index**: List all user forms
- **Form Create**: Create new forms
- **Form Manage**: Manage individual forms
- **Auth Pages**: Login and registration

## API Endpoints

### Authentication
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/auth/me          - Get current user
POST /api/auth/logout      - User logout
```

### Forms
```
GET    /api/forms          - List user forms
POST   /api/forms          - Create new form
GET    /api/forms/:id      - Get form details
PUT    /api/forms/:id      - Update form
DELETE /api/forms/:id      - Delete form
GET    /api/forms/:id/schema - Get form schema (public/private)
```

### Submissions
```
POST /api/submissions/forms/:formId           - Submit form data
GET  /api/submissions/forms/:formId           - Get form submissions (owner)
GET  /api/submissions/:id                     - Get specific submission
GET  /api/submissions/forms/:formId/submissions/:submissionId/success - Success page
```

## Environment Setup

### Backend Environment (.env.hono)
```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key
DATABASE_URL="postgresql://username:password@localhost:5432/develform"
VITE_API_URL=http://localhost:3000/api
```

### Database Schema
The Prisma schema preserves all Laravel database relationships:
- Users with forms relationship
- Forms with submissions relationship
- Submission tokens for secure access
- Proper foreign key constraints and cascading deletes

## Development Commands

### Backend (Hono)
```bash
bun run dev:hono          # Start Hono development server
bun run db:generate       # Generate Prisma client
bun run db:migrate        # Run database migrations
bun run db:push           # Push schema to database
bun run db:studio         # Open Prisma Studio
```

### Frontend (React)
```bash
npm run dev               # Start Vite development server
npm run build             # Build for production
npm run dev:full          # Run both Hono and Vite concurrently
```

## Key Differences from Original

### Authentication
- **Laravel Sanctum** → **JWT tokens** stored in localStorage
- **Session-based** → **Stateless JWT authentication**
- **Laravel Auth middleware** → **Custom Hono JWT middleware**

### Data Fetching
- **Inertia.js props** → **TanStack Query hooks**
- **Server-side rendering** → **Client-side data fetching**
- **Form submissions via Inertia** → **API calls with mutations**

### Routing
- **Laravel routes** → **TanStack Router file-based routing**
- **Inertia.js navigation** → **TanStack Router navigation**
- **Server-side redirects** → **Client-side route guards**

### State Management
- **Laravel session state** → **TanStack Query cache**
- **Inertia.js shared data** → **React Context + Query cache**
- **Server-side flash messages** → **Client-side toast notifications**

## Migration Benefits

1. **Performance**: Bun's fast JavaScript runtime
2. **Type Safety**: Full TypeScript from backend to frontend
3. **Modern Stack**: Latest React patterns with TanStack ecosystem
4. **Developer Experience**: Hot reload, better debugging
5. **Deployment**: Simpler containerization and scaling

## Preserved Features

1. **UI/UX**: All React components kept identical
2. **Styling**: Bootstrap 5 styling preserved
3. **Form Builder**: FormIO integration maintained
4. **Business Logic**: All form and submission logic intact
5. **Database Schema**: Identical table structure and relationships

## Testing

The application maintains the same functionality as the Laravel version:
- User registration and authentication
- Form creation and management
- Form submissions with public/private access
- Dashboard analytics and overview
- Responsive design and accessibility

## Future Enhancements

With the new stack, you can now easily add:
- Real-time updates with WebSockets
- GraphQL API layer
- Advanced caching strategies
- Microservices architecture
- Modern deployment options (Vercel, Railway, etc.)

The migration preserves all existing functionality while providing a foundation for modern web development practices.