# Automated Type Generation System

This document describes the automated type generation system that eliminates the need for manual type declarations and ensures type consistency across the client-server boundary.

## Overview

The automated type generation system solves the problem of manual type maintenance by:

1. **Automatically generating shared types** from the backend database schema
2. **Detecting schema changes** and regenerating types when needed  
3. **Providing a single source of truth** for all API types
4. **Eliminating manual type duplication** between client and server

## How It Works

### 🔄 Automatic Generation

Types are automatically generated from:
- **Database schema** (via Drizzle ORM exports)
- **API validation schemas** (from route definitions)
- **Response structures** (from actual API endpoint patterns)

### 📁 File Structure

```
/shared/types/
├── index.ts           # Auto-generated shared types (DO NOT EDIT MANUALLY)
└── package.json       # Package configuration with dependencies

/scripts/
├── generate-types-enhanced.ts  # Main type generation script
└── watch-types.ts             # File watcher for automatic regeneration
```

### 🛠️ Available Scripts

```bash
# Generate types from backend sources
npm run types:generate

# Force regeneration (ignore timestamps)
npm run types:generate -- --force

# Watch for backend changes and auto-regenerate
npm run types:watch

# Generate types + check client/server compilation
npm run types:check
```

## Features

### ✅ Schema Change Detection
- Automatically detects when database schema files change
- Only regenerates when necessary (based on file timestamps)
- Force regeneration available with `--force` flag

### ✅ Smart Type Mapping
- Maps Drizzle schema types to API-friendly interfaces
- Includes proper nullability and type safety
- Maintains compatibility with frontend FormType requirements

### ✅ Complete API Coverage
- Request types for all endpoints
- Response types for all endpoints  
- Error types and union types
- Endpoint mapping for typed API clients

### ✅ Build Integration
- Types are generated automatically during build process
- No manual intervention required
- CI/CD friendly

## Generated Type Categories

### Database Schema Types
```typescript
// Auto-generated from Drizzle schema
export interface User { /* ... */ }
export interface Form { /* ... */ }
export interface FormVersion { /* ... */ }
export interface Submission { /* ... */ }
```

### API Request Types
```typescript
// Auto-generated from route validation schemas
export interface CreateFormRequest { /* ... */ }
export interface UpdateFormRequest { /* ... */ }
export interface CreateSubmissionRequest { /* ... */ }
```

### API Response Types  
```typescript
// Auto-generated from API response patterns
export interface GetFormsResponse { /* ... */ }
export interface CreateFormResponse { /* ... */ }
export interface GetSubmissionResponse { /* ... */ }
```

### Endpoint Mapping
```typescript
// Complete type-safe API mapping
export interface ApiResponses {
  'GET /forms': FormApiResponse<GetFormsResponse>;
  'POST /forms': FormApiResponse<CreateFormResponse>;
  // ... all endpoints mapped
}
```

## Usage

### For Backend Developers

**When adding new database tables:**
1. Add the table to `server/src/db/schema.ts`
2. Run `npm run types:generate` (or it will auto-generate on next build)
3. Types are immediately available in shared package

**When adding new API endpoints:**
1. Add validation schemas to route files
2. Types are extracted automatically on next generation
3. Frontend gets typed API contracts automatically

### For Frontend Developers

**Import shared types:**
```typescript
import type { 
  Form, 
  CreateFormRequest, 
  GetFormsResponse 
} from '@develform/shared-types';
```

**Use with API client:**
```typescript
const response: GetFormsResponse = await api.get('/forms');
const newForm = await api.post<CreateFormRequest>('/forms', formData);
```

## Migration Guide

### From Manual Types

The old manual type system has been completely replaced:

**Before (Manual):**
```typescript
// client/src/types/api.d.ts - manually maintained
export interface Form {
  id: number;
  name: string;
  // ... manually kept in sync
}

// server/src/types/index.ts - manually maintained  
export interface Form {
  id: number;
  name: string;
  // ... could drift from client
}
```

**After (Automated):**
```typescript
// shared/types/index.ts - auto-generated
export interface Form {
  id: number;
  name: string;
  // ... always in sync with schema
}

// client and server just re-export:
export * from '@develform/shared-types';
```

## Benefits

### 🚀 Developer Experience
- **No more manual type maintenance** - types update automatically
- **Guaranteed consistency** - impossible for client/server types to drift
- **Instant feedback** - type errors surface immediately when schema changes
- **Zero configuration** - works out of the box

### 🛡️ Type Safety
- **End-to-end type safety** from database to frontend
- **API contract validation** at compile time
- **Breaking change detection** when schema changes
- **IntelliSense support** for all API interactions

### 🔧 Maintenance
- **Single source of truth** in database schema
- **Automated updates** on every build
- **CI/CD integration** with type checking
- **No merge conflicts** on type definitions

## Troubleshooting

### Types Not Updating
```bash
# Force regeneration
npm run types:generate -- --force

# Check if shared deps are installed
cd shared/types && npm install
```

### Build Errors After Schema Changes
```bash
# Regenerate types first
npm run types:generate

# Then check what broke
npm run types:check
```

### Watcher Not Working
```bash
# Restart the watcher
npm run types:watch
```

## Future Enhancements

- [ ] OpenAPI schema generation from types
- [ ] Runtime type validation with Zod
- [ ] GraphQL schema generation
- [ ] Advanced type transformations
- [ ] Custom type annotations in schema comments