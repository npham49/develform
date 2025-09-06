# Submissions Tests Documentation

This document describes the test suite for form submission API endpoints.

## Test File: `submissions-simple.test.ts`

### Purpose
Tests form submission management including creation, retrieval, access control, and anonymous submission handling.

### Test Suites

#### GET /api/submissions/:id

**Purpose**: Tests retrieval of specific submission by ID

**Test Cases**:

1. **Return submission for form owner**
   - **Setup**: Mock submission data with form owner access
   - **Steps**:
     1. Mock `getSubmissionById` to return submission detail
     2. Call with submission ID, user ID (form owner), and no token
   - **Expected**: Submission data is returned for form owner
   - **Edge Cases**: Form owner accessing any submission on their forms

2. **Return submission for anonymous user with valid token**
   - **Setup**: Mock submission data with valid anonymous token
   - **Steps**:
     1. Mock `getSubmissionById` to return submission detail
     2. Call with submission ID, no user ID, and valid token
   - **Expected**: Submission data is returned for valid token
   - **Edge Cases**: Anonymous users with valid submission tokens

3. **Validate submission ID parameter**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid string ID
     2. Test with valid numeric string ID
   - **Expected**: Validation throws error for invalid ID, returns number for valid ID
   - **Edge Cases**: Non-numeric strings, negative numbers, zero

4. **Handle submission not found**
   - **Setup**: Mock missing submission
   - **Steps**:
     1. Mock `getSubmissionById` to return empty array
     2. Call with non-existent submission ID
   - **Expected**: Empty array is returned
   - **Edge Cases**: Deleted submissions, non-existent IDs

5. **Handle access denied for unauthorized users**
   - **Setup**: Mock submission without proper access
   - **Steps**:
     1. Mock `getSubmissionById` to return empty array for unauthorized access
     2. Call with valid ID but without proper credentials
   - **Expected**: Empty array is returned (access denied)
   - **Edge Cases**: Users trying to access others' submissions without tokens

#### GET /api/forms/:formId/submissions

**Purpose**: Tests retrieval of all submissions for a form

**Test Cases**:

1. **Return all submissions for form owner**
   - **Setup**: Mock multiple submissions for form owner
   - **Steps**:
     1. Mock `getFormSubmissions` to return submission list
     2. Call with form ID and owner user ID
   - **Expected**: All form submissions are returned
   - **Edge Cases**: Multiple submissions with different data structures

2. **Handle empty submissions list**
   - **Setup**: Mock form with no submissions
   - **Steps**:
     1. Mock `getFormSubmissions` to return empty array
     2. Call with form ID that has no submissions
   - **Expected**: Empty array is returned
   - **Edge Cases**: New forms, forms with deleted submissions

3. **Validate form ID parameter**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with invalid string form ID
     2. Test with valid numeric string form ID
   - **Expected**: Validation throws error for invalid ID, returns number for valid ID
   - **Edge Cases**: Special characters, floating point numbers

4. **Handle database errors**
   - **Setup**: Mock database failure
   - **Steps**:
     1. Mock `getFormSubmissions` to reject with error
     2. Call service and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Connection timeouts, query failures

#### POST /api/forms/:formId/submissions

**Purpose**: Tests creation of new form submissions

**Test Cases**:

1. **Create submission for public form (authenticated user)**
   - **Setup**: Mock public form and valid submission data
   - **Steps**:
     1. Mock `getFormByIdForSubmission` to return public form
     2. Mock `createSubmission` to return created submission
     3. Call with form ID, user ID, and submission data
   - **Expected**: Submission is created successfully
   - **Edge Cases**: Authenticated users submitting to public forms

2. **Create submission for public form (anonymous user)**
   - **Setup**: Mock public form and anonymous submission
   - **Steps**:
     1. Mock `getFormByIdForSubmission` to return public form
     2. Mock `createSubmission` to return submission with anonymous token
     3. Call with form ID, no user ID, and submission data
   - **Expected**: Submission is created with anonymous token
   - **Edge Cases**: Anonymous submissions with generated tokens

3. **Create submission for private form (authenticated user)**
   - **Setup**: Mock private form accessible to user
   - **Steps**:
     1. Mock `getFormByIdForSubmission` to return private form
     2. Mock `createSubmission` to return created submission
     3. Call with form ID, user ID, and submission data
   - **Expected**: Submission is created successfully
   - **Edge Cases**: Authorized users submitting to private forms

4. **Generate anonymous submission token**
   - **Setup**: Mock crypto random bytes generation
   - **Steps**:
     1. Mock `crypto.randomBytes` to return mock buffer
     2. Mock buffer toString to return token string
     3. Generate token for anonymous submission
   - **Expected**: Unique token is generated for anonymous access
   - **Edge Cases**: Token uniqueness, proper encoding

5. **Validate submission data**
   - **Setup**: Test validation function with various inputs
   - **Steps**:
     1. Test with missing required fields
     2. Test with valid submission data
     3. Test with extra fields
   - **Expected**: Validation throws error for invalid data, passes for valid data
   - **Edge Cases**: Empty objects, null values, undefined fields

6. **Handle form not found**
   - **Setup**: Mock missing form
   - **Steps**:
     1. Mock `getFormByIdForSubmission` to return empty array
     2. Attempt to create submission for non-existent form
   - **Expected**: Empty array is returned (form not found)
   - **Edge Cases**: Deleted forms, invalid form IDs

7. **Handle access denied for private forms**
   - **Setup**: Mock private form not accessible to user
   - **Steps**:
     1. Mock `getFormByIdForSubmission` to return empty array for unauthorized access
     2. Attempt to create submission without proper access
   - **Expected**: Empty array is returned (access denied)
   - **Edge Cases**: Anonymous users trying to submit to private forms

8. **Handle database errors during creation**
   - **Setup**: Mock database failure during submission creation
   - **Steps**:
     1. Mock `createSubmission` to reject with error
     2. Attempt to create submission and expect error
   - **Expected**: Database error is properly thrown
   - **Edge Cases**: Constraint violations, data too large, connection failures

### Mock Services Used
- `mockSubmissionsService`: Database operations for submission management
  - `getSubmissionById`: Retrieve specific submission with access control
  - `getFormSubmissions`: Get all submissions for a form
  - `getFormByIdForSubmission`: Verify form exists and access permissions
  - `createSubmission`: Create new submission with optional anonymous token
- `mockCrypto`: Token generation for anonymous submissions
  - `randomBytes`: Generate cryptographically secure random data

### Key Testing Patterns
- Access control testing for form owners vs anonymous users
- Anonymous token generation and validation
- Public vs private form submission handling
- Input validation for submission data
- Error handling for various failure scenarios
- Database operation mocking for submission lifecycle
- Parameter validation for type safety and security
- Authorization verification for different user types