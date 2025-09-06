# Versions Tests Documentation

This document describes the test suite for form version management API endpoints.

## Test File: `versions-simple.test.ts`

### Purpose

Tests form version management including version history, creation, updates, and SHA-based retrieval.

### Test Suites

#### GET /api/forms/:formId/versions

**Purpose**: Tests retrieval of all versions for a form

**Test Cases**:

1. **Return all versions for a form**
   - **Setup**: Mock multiple versions with different statuses
   - **Steps**:
     1. Mock `getFormVersions` to return version list
     2. Call with form ID
   - **Expected**: All form versions are returned in order
   - **Edge Cases**: Published and unpublished versions, chronological ordering

2. **Validate form ID parameter**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid string form ID
     2. Test with valid numeric string form ID
   - **Expected**: Validation throws error for invalid ID, returns number for valid ID
   - **Edge Cases**: Non-numeric strings, negative numbers, decimal values

3. **Handle empty versions list**
   - **Setup**: Mock form with no versions
   - **Steps**:
     1. Mock `getFormVersions` to return empty array
     2. Call with form ID that has no versions
   - **Expected**: Empty array is returned
   - **Edge Cases**: New forms, forms with deleted versions

4. **Handle database errors**
   - **Setup**: Mock database failure
   - **Steps**:
     1. Mock `getFormVersions` to reject with error
     2. Call service and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Connection failures, query timeouts

#### GET /api/forms/:formId/versions/:sha

**Purpose**: Tests retrieval of specific version by SHA

**Test Cases**:

1. **Return version by SHA**
   - **Setup**: Mock version with specific SHA
   - **Steps**:
     1. Mock `getVersionBySha` to return version data
     2. Call with form ID and version SHA
   - **Expected**: Specific version is returned
   - **Edge Cases**: Valid SHA strings, complete version data

2. **Validate SHA parameter**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid SHA format
     2. Test with valid SHA format
     3. Test with empty SHA
   - **Expected**: Validation throws error for invalid SHA, passes for valid SHA
   - **Edge Cases**: Wrong length SHAs, non-hex characters, case sensitivity

3. **Handle version not found**
   - **Setup**: Mock missing version
   - **Steps**:
     1. Mock `getVersionBySha` to return empty array
     2. Call with non-existent SHA
   - **Expected**: Empty array is returned
   - **Edge Cases**: Deleted versions, invalid SHAs

4. **Handle database errors for SHA lookup**
   - **Setup**: Mock database failure during SHA lookup
   - **Steps**:
     1. Mock `getVersionBySha` to reject with error
     2. Call service and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Index failures, corruption

#### POST /api/forms/:formId/versions

**Purpose**: Tests creation of new form versions

**Test Cases**:

1. **Create new version successfully**
   - **Setup**: Mock valid version data and successful creation
   - **Steps**:
     1. Mock `createVersion` to return created version
     2. Call with form ID and version data
   - **Expected**: New version is created and returned
   - **Edge Cases**: Complete version data with description and schema

2. **Generate SHA for new version**
   - **Setup**: Test SHA generation from version data
   - **Steps**:
     1. Create hash from version content
     2. Validate SHA format and uniqueness
   - **Expected**: Valid SHA is generated for version identification
   - **Edge Cases**: Different content producing different SHAs

3. **Validate version data**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with missing required fields
     2. Test with valid version data
     3. Test with invalid schema format
   - **Expected**: Validation throws error for invalid data, passes for valid data
   - **Edge Cases**: Empty descriptions, malformed schemas, null values

4. **Handle duplicate SHA conflicts**
   - **Setup**: Mock SHA collision scenario
   - **Steps**:
     1. Mock `createVersion` to reject with unique constraint error
     2. Attempt to create version with duplicate content
   - **Expected**: Appropriate error is thrown for SHA conflicts
   - **Edge Cases**: Identical content, hash collisions

5. **Handle database errors during creation**
   - **Setup**: Mock database failure during version creation
   - **Steps**:
     1. Mock `createVersion` to reject with error
     2. Attempt to create version and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Foreign key violations, data too large

#### PATCH /api/forms/:formId/versions/:sha

**Purpose**: Tests updating existing form versions

**Test Cases**:

1. **Update version successfully**
   - **Setup**: Mock valid update data and successful update
   - **Steps**:
     1. Mock `updateVersion` to return updated version
     2. Call with form ID, SHA, and update data
   - **Expected**: Version is updated and returned
   - **Edge Cases**: Partial updates, description changes

2. **Validate update data**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with empty update data
     2. Test with valid update fields
     3. Test with protected fields (SHA, createdAt)
   - **Expected**: Validation allows valid updates, rejects protected field changes
   - **Edge Cases**: Attempting to change immutable fields

3. **Handle version not found for update**
   - **Setup**: Mock missing version
   - **Steps**:
     1. Mock `updateVersion` to return empty array
     2. Attempt to update non-existent version
   - **Expected**: Empty array is returned (version not found)
   - **Edge Cases**: Deleted versions, invalid SHAs

4. **Handle update errors**
   - **Setup**: Mock database failure during update
   - **Steps**:
     1. Mock `updateVersion` to reject with error
     2. Attempt to update and expect error
   - **Expected**: Update error is properly thrown
   - **Edge Cases**: Concurrent updates, constraint violations

#### POST /api/forms/:formId/versions/:sha/make-latest

**Purpose**: Tests making a version the latest/published version

**Test Cases**:

1. **Make version latest successfully**
   - **Setup**: Mock valid version and successful update
   - **Steps**:
     1. Mock `makeVersionLatest` to return updated version
     2. Call with form ID and version SHA
   - **Expected**: Version is marked as latest and previous latest is unmarked
   - **Edge Cases**: Version promotion, single latest per form

2. **Validate version exists before promotion**
   - **Setup**: Test existence validation
   - **Steps**:
     1. Mock version lookup before promotion
     2. Verify version exists and belongs to form
   - **Expected**: Only existing versions can be promoted
   - **Edge Cases**: Cross-form version access attempts

3. **Handle concurrent latest updates**
   - **Setup**: Mock concurrent promotion attempts
   - **Steps**:
     1. Mock `makeVersionLatest` with race condition handling
     2. Test atomic update behavior
   - **Expected**: Only one version is latest at any time
   - **Edge Cases**: Multiple simultaneous promotion requests

4. **Handle database errors during promotion**
   - **Setup**: Mock database failure during promotion
   - **Steps**:
     1. Mock `makeVersionLatest` to reject with error
     2. Attempt to promote and expect error
   - **Expected**: Promotion error is properly thrown
   - **Edge Cases**: Transaction failures, locking issues

### Mock Services Used

- `mockVersionsService`: Database operations for version management
  - `getFormVersions`: Retrieve all versions for a form
  - `getVersionBySha`: Get specific version by SHA identifier
  - `createVersion`: Create new version with generated SHA
  - `updateVersion`: Update existing version metadata
  - `makeVersionLatest`: Promote version to latest/published status

### Key Testing Patterns

- SHA validation and generation for version identification
- Version lifecycle management (create, update, promote)
- Chronological ordering and history tracking
- Atomic operations for version promotion
- Input validation for version data and identifiers
- Error handling for various failure scenarios
- Database constraint testing for unique SHAs
- Access control for form-specific version operations
- Parameter validation for type safety and format compliance
