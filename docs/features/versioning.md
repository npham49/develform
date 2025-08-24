# Form Versioning Feature

## Overview

The Form Versioning feature allows forms to have multiple versions with complete history tracking, schema management, and flexible version control operations. Each form maintains a history of versions with the ability to publish, revert, and manage schema changes across time.

## Core Concepts

### Version Structure

Each form version contains:

- **Description**: Human-readable description of changes
- **SHA (CUID)**: Unique identifier for the version
- **Schema**: The form schema definition (JSON)
- **Published Status**: Whether this version is live/published
- **Metadata**: Timestamps, author, etc.

### Version States

- **Draft**: Saved but not published
- **Published**: Live version receiving submissions
- **Archived**: Previous published versions

## Database Schema Changes

### New Tables Required

- **Form Versions Table**: Store version history with SHA identifiers, descriptions, schemas, and publication status
- **Indexes**: Optimize for form ID lookups and published version queries
- **Constraints**: Ensure only one published version per form

### Modified Tables

- **Forms Table**: Add reference to live version
- **Submissions Table**: Add version SHA tracking for audit trail

## Implementation Phases

### Phase 1: Backend Foundation

**Goal**: Set up database schema and basic version CRUD operations

#### Tasks:

1. **Database Migration**
   - Create `form_versions` table
   - Add `live_version_id` to `forms` table
   - Add `version_sha` to `submissions` table
   - Create necessary indexes

2. **Schema Updates** (`server/src/db/schema.ts`)
   - Define `formVersions` table schema
   - Update `forms` and `submissions` schemas
   - Add TypeScript types

3. **Basic Services** (`server/src/services/`)
   - `versions.ts`: CRUD operations for versions
   - Update `forms.ts` to handle version relationships
   - Update `submissions.ts` to track version SHA

4. **API Endpoints** (`server/src/routes/`)
   - `GET /forms/:id/versions` - List all versions
   - `POST /forms/:id/versions` - Create new version
   - `PUT /forms/:id/versions/:sha` - Update version
   - `DELETE /forms/:id/versions/:sha` - Delete version
   - `POST /forms/:id/versions/:sha/publish` - Publish version

#### Acceptance Criteria:

- [ ] Database schema created and migrated
- [ ] Basic version CRUD operations working
- [ ] Forms properly linked to live versions
- [ ] Submissions track version SHA
- [ ] Chronological history tree displays on form manage page

### Phase 2: Frontend Schema Management

**Goal**: Implement client-side schema editing with undo/redo functionality

#### Tasks:

1. **Schema History Hook** (`client/src/hooks/`)
   - `use-schema-history.ts`: Manage schema edit history
   - Track changes in memory (not persisted)
   - Implement undo/redo stack
   - Auto-save draft changes

2. **Version Management Components**
   - Version selector dropdown for switching between versions
   - Chronological history tree showing all versions on form manage page
   - Enhanced schema editor with integrated history tracking
   - Version action buttons for publish, save, and revert operations

3. **Enhanced Form Editor**
   - Integrate schema history tracking for current session
   - Real-time draft saving using browser local storage
   - Visual indicators for unsaved changes and dirty state
   - Side-by-side version comparison view

#### Acceptance Criteria:

- [ ] Schema changes tracked in memory during editing sessions
- [ ] Undo/redo functionality working within current session
- [ ] Draft changes auto-saved to browser local storage
- [ ] Version selector integrated into form editor interface
- [ ] History tree shows real-time updates for draft changes

### Phase 3: Version Control Operations

**Goal**: Implement version options and controlled editing workflow

#### Backend Implementation:

1. **Reset to Version Operation**
   - Delete all versions created after target version
   - Set target version as published
   - Update form's live version reference

2. **Make Version Live Operation**
   - Unpublish current live version
   - Set target version as published
   - Preserve complete version history

3. **Create Version from Previous Operation**
   - Create new version using old schema as base
   - Mark new version as draft for editing
   - Preserve merge logic placeholder for future enhancement

#### Frontend Implementation:

4. **Version Options Interface**
   - Modal presenting three version operation options
   - Clear warnings for destructive operations
   - Multi-step confirmation process for safety

5. **Controlled Editing Workflow**
   - Only latest draft versions can be edited directly
   - "Create New Version" only available on latest version
   - To edit older versions: use "Create Version from Previous" option
   - Clear version state management and user guidance

6. **Version Comparison Interface**
   - Button-triggered modal for version selection
   - Side-by-side schema difference visualization
   - Highlighted changes between selected versions
   - Impact preview before executing operations

#### Acceptance Criteria:

- [ ] All three version operations implemented and tested
- [ ] Frontend provides clear version options with explanations
- [ ] Only latest draft versions are directly editable
- [ ] "Create New Version" restricted to latest version only
- [ ] Version comparison accessible via dedicated button/modal
- [ ] Destructive operations require multi-step confirmation
- [ ] History tree updates immediately after operations
- [ ] Clear user guidance for version workflow

### Phase 4: Enhanced UI/UX

**Goal**: Polish the versioning experience

#### Tasks:

1. **Enhanced History Tree on Form Manage Page**
   - Chronological tree view showing all versions with branching
   - Interactive timeline with version metadata
   - Author information, timestamps, and descriptions
   - Visual indicators for published vs draft versions

2. **Submission Version Integration**
   - Display version SHA prominently on submission pages
   - Link to view exact schema used for submission
   - Version metadata embedded in submission details

3. **Version Analytics Dashboard**
   - Submission counts and metrics per version
   - Performance comparison between versions
   - A/B testing insights and conversion tracking

#### Acceptance Criteria:

- [ ] Chronological history tree integrated into form manage page
- [ ] Intuitive version timeline with interactive navigation
- [ ] Submissions clearly display version information and links
- [ ] Analytics dashboard provides actionable version insights

## API Endpoints Specification

### Version Management Endpoints

- **GET** `/api/forms/:formId/versions` - List all versions for a form
- **POST** `/api/forms/:formId/versions` - Create new version with optional publish
- **PUT** `/api/forms/:formId/versions/:sha` - Update version (draft only)
- **DELETE** `/api/forms/:formId/versions/:sha` - Delete version (draft only)
- **POST** `/api/forms/:formId/versions/:sha/publish` - Publish specific version

### Revert Operation Endpoints

- **POST** `/api/forms/:formId/versions/:sha/force-reset` - Force reset to version
- **POST** `/api/forms/:formId/versions/:sha/make-live` - Make version live
- **POST** `/api/forms/:formId/versions/:sha/make-latest` - Create latest from version

## Data Models

### FormVersion Structure

- Unique ID and form relationship
- Version SHA (CUID) for immutable identification
- Optional description for change documentation
- Complete schema snapshot as JSON
- Publication status and timestamp
- Author tracking and audit timestamps

### Updated Form Model

- Reference to current live version
- Optional embedded version data for performance
- Array of all versions for history display

### Updated Submission Model

- Version SHA tracking for audit trail
- Optional version relationship for schema reference

## Technical Considerations

### Performance

- Index on `(form_id, is_published)` for fast live version lookup
- Limit version history display (pagination)
- Consider version pruning strategy for old forms

### Data Integrity

- Unique constraint on published versions per form
- Cascade deletes properly configured
- Version SHA validation

### Security

- Only form owners can manage versions
- Version operations require proper permissions
- Audit trail for version changes

### Future Enhancements (TODOs)

- **Merge Logic**: Implement Git-style merge for conflicting schema changes
- **Branch Management**: Support for feature branches in schema development
- **Version Tags**: Named versions (v1.0, beta, etc.)
- **Automated Testing**: Version compatibility testing
- **Schema Validation**: Ensure schema changes don't break existing submissions

## Migration Strategy

1. **Backward Compatibility**: Existing forms get a default version created
2. **Gradual Rollout**: Feature flag to enable versioning per form
3. **Data Migration**: Migrate existing form schemas to first version
4. **Submission Linking**: Backfill version SHA for existing submissions

## Testing Strategy

### Unit Tests

- Version CRUD operations
- Schema history management
- Revert operation logic

### Integration Tests

- End-to-end version workflow
- Form submission with versions
- Multi-user version conflicts

### Performance Tests

- Large version histories
- Concurrent version operations
- Schema diff performance

This feature documentation provides a complete roadmap for implementing form versioning in phases, with clear acceptance criteria and technical specifications for each phase.
