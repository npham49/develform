# Forms Tests Documentation

This document describes the test suite for form management API endpoints.

## Test File: `forms-simple.test.ts`

### Purpose

Tests CRUD operations for forms including creation, retrieval, updates, and access control.

### Test Suites

#### GET /api/forms

**Purpose**: Tests retrieval of user's forms

**Test Cases**:

1. **Return all forms for authenticated user**
   - **Setup**: Mock user with multiple forms (public and private)
   - **Steps**:
     1. Mock `getUserForms` to return form list
     2. Call service with user ID
   - **Expected**: All user's forms are returned
   - **Edge Cases**: Mixed public/private forms, multiple forms

2. **Handle empty forms list**
   - **Setup**: Mock user with no forms
   - **Steps**:
     1. Mock `getUserForms` to return empty array
     2. Call service with user ID
   - **Expected**: Empty array is returned
   - **Edge Cases**: New user, user with deleted forms

3. **Handle database errors**
   - **Setup**: Mock database failure
   - **Steps**:
     1. Mock `getUserForms` to reject with error
     2. Call service and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Connection failures, query errors

#### GET /api/forms/:id

**Purpose**: Tests retrieval of specific form by ID

**Test Cases**:

1. **Return public form for authenticated user**
   - **Setup**: Mock public form data
   - **Steps**:
     1. Mock `getFormByIdForPublic` to return form
     2. Call with form ID and user ID
   - **Expected**: Form data is returned
   - **Edge Cases**: Public forms accessible to authenticated users

2. **Return public form for anonymous user**
   - **Setup**: Mock public form data
   - **Steps**:
     1. Mock `getFormByIdForPublic` to return form
     2. Call with form ID and null user ID
   - **Expected**: Form data is returned
   - **Edge Cases**: Public forms accessible to everyone

3. **Validate form ID parameter**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid string ID
     2. Test with valid numeric string ID
   - **Expected**: Validation throws error for invalid ID, returns number for valid ID
   - **Edge Cases**: Non-numeric strings, empty strings, special characters

4. **Handle form not found**
   - **Setup**: Mock missing form
   - **Steps**:
     1. Mock `getFormByIdForPublic` to return empty array
     2. Call with non-existent form ID
   - **Expected**: Empty array is returned
   - **Edge Cases**: Deleted forms, non-existent IDs

#### GET /api/forms/:id/schema

**Purpose**: Tests retrieval of form schema

**Test Cases**:

1. **Return form schema for authenticated user**
   - **Setup**: Mock form with schema data
   - **Steps**:
     1. Mock `getFormSchemaById` to return schema
     2. Call with form ID and user ID
   - **Expected**: Schema data is returned
   - **Edge Cases**: Complex schemas with multiple components

2. **Return form schema for anonymous user**
   - **Setup**: Mock form with schema data
   - **Steps**:
     1. Mock `getFormSchemaById` to return schema
     2. Call with form ID and null user ID
   - **Expected**: Schema data is returned
   - **Edge Cases**: Public form schemas accessible to everyone

3. **Handle schema not found**
   - **Setup**: Mock missing schema
   - **Steps**:
     1. Mock `getFormSchemaById` to return empty array
     2. Call with non-existent form ID
   - **Expected**: Empty array is returned
   - **Edge Cases**: Forms without schemas, deleted forms

#### POST /api/forms

**Purpose**: Tests form creation

**Test Cases**:

1. **Create new form successfully**
   - **Setup**: Mock valid form data and successful creation
   - **Steps**:
     1. Mock `createForm` to return created form
     2. Call with valid form data and user ID
   - **Expected**: New form is created and returned
   - **Edge Cases**: Complete form data with all fields

2. **Validate required fields**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with missing name field
     2. Test with empty name field
     3. Test with valid name field
   - **Expected**: Validation throws error for missing/empty name, passes for valid name
   - **Edge Cases**: Empty strings, whitespace-only strings, null values

3. **Handle creation with optional fields**
   - **Setup**: Mock minimal form data
   - **Steps**:
     1. Mock `createForm` with only required fields
     2. Call with minimal data
   - **Expected**: Form is created with default values for optional fields
   - **Edge Cases**: Only name provided, default privacy settings

4. **Handle database errors during creation**
   - **Setup**: Mock database failure during creation
   - **Steps**:
     1. Mock `createForm` to reject with error
     2. Call with valid data and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Constraint violations, connection failures

#### PATCH /api/forms/:id

**Purpose**: Tests form updates

**Test Cases**:

1. **Update form successfully**
   - **Setup**: Mock valid update data and successful update
   - **Steps**:
     1. Mock `updateForm` to return updated form
     2. Call with form ID, user ID, and update data
   - **Expected**: Form is updated and returned
   - **Edge Cases**: Complete update with all fields

2. **Validate update data**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with empty name field in update
     2. Test with valid name field in update
     3. Test with only description update
   - **Expected**: Validation throws error for empty name, passes for valid updates
   - **Edge Cases**: Partial updates, empty string validation

3. **Handle partial updates**
   - **Setup**: Mock partial update data
   - **Steps**:
     1. Mock `updateForm` with only name field
     2. Call with partial update data
   - **Expected**: Only specified fields are updated
   - **Edge Cases**: Single field updates, preserving existing data

4. **Handle update errors**
   - **Setup**: Mock database failure during update
   - **Steps**:
     1. Mock `updateForm` to reject with error
     2. Call with valid data and expect error
   - **Expected**: Update error is properly thrown
   - **Edge Cases**: Concurrent updates, constraint violations

#### Form Access Control

**Purpose**: Tests form ownership and access permissions

**Test Cases**:

1. **Verify form ownership**
   - **Setup**: Mock form owned by user
   - **Steps**:
     1. Mock `getFormByIdAndOwner` to return form
     2. Call with form ID and owner ID
   - **Expected**: Form is returned for owner
   - **Edge Cases**: User owns form, valid ownership verification

2. **Deny access to non-owned forms**
   - **Setup**: Mock form not owned by user
   - **Steps**:
     1. Mock `getFormByIdAndOwner` to return empty array
     2. Call with form ID and non-owner ID
   - **Expected**: Empty array is returned (access denied)
   - **Edge Cases**: User does not own form, authorization failure

### Mock Services Used

- `mockFormsService`: Database operations for form management
  - `getUserForms`: Retrieve user's forms
  - `getFormByIdForPublic`: Get public form data
  - `getFormSchemaById`: Get form schema
  - `createForm`: Create new form
  - `updateForm`: Update existing form
  - `getFormByIdAndOwner`: Verify form ownership

### Key Testing Patterns

- CRUD operation testing for complete lifecycle
- Input validation for required and optional fields
- Access control testing for public vs private forms
- Error handling for database failures
- Ownership verification for security
- Parameter validation for type safety
- Edge case handling for empty data and missing resources
