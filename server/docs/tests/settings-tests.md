# Settings Tests Documentation

This document describes the test suite for user settings and profile management API endpoints.

## Test File: `settings-simple.test.ts`

### Purpose

Tests user profile management including profile retrieval, updates, and account deletion.

### Test Suites

#### GET /api/settings/profile

**Purpose**: Tests retrieval of user profile information

**Test Cases**:

1. **Return user profile for authenticated user**
   - **Setup**: Mock complete user profile data
   - **Steps**:
     1. Mock `getUserProfile` to return profile data
     2. Call with authenticated user ID
   - **Expected**: Complete user profile is returned
   - **Edge Cases**: Full profile with all fields populated

2. **Handle user not found**
   - **Setup**: Mock missing user
   - **Steps**:
     1. Mock `getUserProfile` to return empty array
     2. Call with non-existent user ID
   - **Expected**: Empty array is returned
   - **Edge Cases**: Deleted users, invalid user IDs

3. **Handle database errors**
   - **Setup**: Mock database failure
   - **Steps**:
     1. Mock `getUserProfile` to reject with error
     2. Call service and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Connection failures, query errors

4. **Extract safe profile data**
   - **Setup**: Test profile data filtering
   - **Steps**:
     1. Mock full user data including sensitive fields
     2. Filter to safe profile fields only
   - **Expected**: Only safe profile fields are returned (no sensitive data)
   - **Edge Cases**: Filtering out passwords, tokens, internal IDs

#### PATCH /api/settings/profile

**Purpose**: Tests updating user profile information

**Test Cases**:

1. **Update profile successfully**
   - **Setup**: Mock valid update data and successful update
   - **Steps**:
     1. Mock `updateUserProfile` to return updated profile
     2. Call with user ID and profile updates
   - **Expected**: Profile is updated and returned
   - **Edge Cases**: Complete profile updates with all fields

2. **Update only name field**
   - **Setup**: Mock partial update with only name
   - **Steps**:
     1. Mock `updateUserProfile` with name-only update
     2. Call with user ID and name update
   - **Expected**: Only name is updated, other fields preserved
   - **Edge Cases**: Single field updates, partial data modification

3. **Update only email field**
   - **Setup**: Mock partial update with only email
   - **Steps**:
     1. Mock `updateUserProfile` with email-only update
     2. Call with user ID and email update
   - **Expected**: Only email is updated, other fields preserved
   - **Edge Cases**: Email format validation, uniqueness constraints

4. **Validate profile update data**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid email format
     2. Test with empty name field
     3. Test with valid update data
   - **Expected**: Validation throws error for invalid data, passes for valid data
   - **Edge Cases**: Email regex validation, name length limits, special characters

5. **Handle validation errors**
   - **Setup**: Mock validation failures
   - **Steps**:
     1. Test email format validation
     2. Test name requirements validation
     3. Test field length limits
   - **Expected**: Appropriate validation errors are thrown
   - **Edge Cases**: Invalid emails, empty names, oversized fields

6. **Handle update conflicts**
   - **Setup**: Mock database constraint violations
   - **Steps**:
     1. Mock `updateUserProfile` to reject with unique constraint error
     2. Attempt to update with duplicate email
   - **Expected**: Constraint violation error is properly thrown
   - **Edge Cases**: Email already in use, concurrent updates

7. **Handle database errors during update**
   - **Setup**: Mock database failure during update
   - **Steps**:
     1. Mock `updateUserProfile` to reject with error
     2. Attempt to update and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Connection timeouts, transaction failures

#### DELETE /api/settings/profile

**Purpose**: Tests user account deletion

**Test Cases**:

1. **Delete user account successfully**
   - **Setup**: Mock successful user deletion
   - **Steps**:
     1. Mock `deleteUser` to return deletion confirmation
     2. Call with authenticated user ID
   - **Expected**: User account is deleted successfully
   - **Edge Cases**: Complete account removal with all related data

2. **Handle user not found for deletion**
   - **Setup**: Mock missing user
   - **Steps**:
     1. Mock `deleteUser` to return empty array
     2. Attempt to delete non-existent user
   - **Expected**: Empty array is returned (user not found)
   - **Edge Cases**: Already deleted users, invalid user IDs

3. **Handle deletion cascade operations**
   - **Setup**: Test related data cleanup
   - **Steps**:
     1. Mock deletion of user and related data
     2. Verify all user-related data is cleaned up
   - **Expected**: User and all related data (forms, submissions) are removed
   - **Edge Cases**: Foreign key cascades, orphaned data prevention

4. **Handle database errors during deletion**
   - **Setup**: Mock database failure during deletion
   - **Steps**:
     1. Mock `deleteUser` to reject with error
     2. Attempt to delete and expect error
   - **Expected**: Deletion error is properly thrown
   - **Edge Cases**: Foreign key constraints, transaction rollbacks

5. **Validate deletion authorization**
   - **Setup**: Test self-deletion validation
   - **Steps**:
     1. Verify user can only delete their own account
     2. Test authorization checks
   - **Expected**: Users can only delete their own accounts
   - **Edge Cases**: Admin privileges, cross-user deletion attempts

### Profile Data Security

#### Sensitive Data Filtering

**Purpose**: Tests filtering of sensitive information from profile responses

**Test Cases**:

1. **Filter password fields**
   - **Setup**: Mock user data with password hash
   - **Steps**:
     1. Extract profile data from full user record
     2. Verify password fields are excluded
   - **Expected**: Password and hash fields are not included in profile
   - **Edge Cases**: Various password field names, hash algorithms

2. **Filter internal system fields**
   - **Setup**: Mock user data with internal fields
   - **Steps**:
     1. Extract profile data and filter system fields
     2. Verify only user-facing fields are included
   - **Expected**: Internal IDs, timestamps, and system fields are excluded
   - **Edge Cases**: Database-specific fields, audit trails

3. **Include safe public fields**
   - **Setup**: Mock user data with safe fields
   - **Steps**:
     1. Extract profile data and include safe fields
     2. Verify public profile fields are included
   - **Expected**: Name, email, avatar, and public fields are included
   - **Edge Cases**: Public vs private field classification

### Mock Services Used

- `mockAuthService`: Database operations for user profile management
  - `getUserProfile`: Retrieve user profile data with safety filtering
  - `updateUserProfile`: Update user profile with validation
  - `deleteUser`: Delete user account and related data cascade

### Key Testing Patterns

- Profile data security and sensitive information filtering
- Partial update handling for profile modifications
- Input validation for profile fields (email, name)
- Account deletion with cascade operations
- Database constraint handling for unique fields
- Authorization verification for self-service operations
- Error handling for various failure scenarios
- Data integrity validation for profile updates
- Safe data exposure for public profile information
