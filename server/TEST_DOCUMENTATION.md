# API Test Suite Documentation

This document provides a comprehensive overview of the Jest test suite implemented for the DevelForm API endpoints. The test suite covers all API routes with complete scenario testing including success cases, error handling, authentication, and authorization.

## Test Infrastructure

### Technology Stack
- **Testing Framework**: Jest with TypeScript support
- **HTTP Testing**: Hono framework's built-in testing capabilities
- **Database Mocking**: Custom Drizzle ORM mocks
- **Authentication Mocking**: JWT and middleware mocking

### Test Structure
```
src/__tests__/
├── setup.ts                    # Global test setup and environment configuration
├── mocks.ts                   # Database and service layer mocking utilities
├── helpers.ts                 # Test helper functions and utilities
├── basic.test.ts             # Basic functionality verification
└── routes/                   # Route-specific test suites
    ├── auth.test.ts          # Authentication endpoint tests
    ├── forms.test.ts         # Forms CRUD operation tests
    ├── versions.test.ts      # Version management tests
    ├── submissions.test.ts   # Form submission tests
    └── settings.test.ts      # User settings tests
```

## Test Configuration

### Jest Configuration (`jest.config.mjs`)
- **Preset**: ts-jest for TypeScript support
- **Environment**: Node.js environment
- **Coverage**: Configured for comprehensive code coverage reporting
- **Setup**: Automated test environment setup with mocks

### Environment Setup (`setup.ts`)
- Configures test environment variables
- Mocks global functions (fetch, console)
- Sets up authentication secrets for testing

## Mock Infrastructure

### Database Mocking (`mocks.ts`)
The test suite includes comprehensive database mocking that simulates Drizzle ORM operations:

```typescript
// Mock data objects
export const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', ... }
export const mockForm = { id: 1, name: 'Test Form', isPublic: true, ... }
export const mockFormVersion = { id: 1, versionSha: 'abc123', ... }
export const mockSubmission = { id: 1, formId: 1, data: {...}, ... }

// Database operation mocking
export const createMockDb = () => ({
  // Provides mocked query builder methods
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  // ... other Drizzle methods
})
```

### Authentication Mocking (`helpers.ts`)
- **mockAuthMiddleware**: Simulates authenticated requests
- **mockOptionalAuthMiddleware**: Handles optional authentication scenarios
- **mockFormWriteCheckMiddleware**: Tests form ownership authorization

## API Endpoint Test Coverage

## 1. Authentication Routes (`/api/auth`)

### POST /api/auth/github/callback
**Purpose**: Handle GitHub OAuth authentication flow

**Test Scenarios**:
- ✅ **Existing User Authentication**: Verifies successful login for existing users
- ✅ **New User Creation**: Tests user creation for first-time GitHub users
- ✅ **Email-based User Linking**: Links GitHub accounts to existing email accounts
- ✅ **Email-less GitHub Users**: Handles GitHub users without public emails
- ❌ **Missing Code Parameter**: Returns 400 for missing OAuth code
- ❌ **Invalid Access Token**: Returns 400 when GitHub token exchange fails
- ❌ **Database Errors**: Returns 500 for database connection issues

**Key Validations**:
- JWT token generation and cookie setting
- User data consistency between GitHub and database
- Proper error handling for OAuth flow failures

### GET /api/auth/user
**Purpose**: Retrieve current authenticated user information

**Test Scenarios**:
- ✅ **Authenticated Access**: Returns user data for valid JWT tokens
- ❌ **Unauthenticated Access**: Returns 401 for missing/invalid tokens

### POST /api/auth/logout
**Purpose**: Log out current user and clear authentication

**Test Scenarios**:
- ✅ **Successful Logout**: Clears auth cookies and returns success message
- ❌ **Unauthenticated Logout**: Returns 401 for non-authenticated requests

---

## 2. Forms Routes (`/api/forms`)

### GET /api/forms
**Purpose**: Retrieve all forms created by the authenticated user

**Test Scenarios**:
- ✅ **Authenticated User Forms**: Returns user's forms with metadata
- ❌ **Unauthenticated Access**: Returns 401 for missing authentication
- ❌ **Database Errors**: Returns 500 for database connection issues

### GET /api/forms/:id
**Purpose**: Retrieve specific form data (public endpoint with optional auth)

**Test Scenarios**:
- ✅ **Public Form - Authenticated**: Returns form data for authenticated users
- ✅ **Public Form - Anonymous**: Returns form data for anonymous users
- ❌ **Invalid Form ID**: Returns 400 for non-numeric form IDs
- ❌ **Form Not Found**: Returns 404 for non-existent forms
- ❌ **Database Errors**: Returns 500 for database issues

### GET /api/forms/:id/schema
**Purpose**: Retrieve form schema for rendering forms

**Test Scenarios**:
- ✅ **Schema Retrieval - Authenticated**: Returns form schema for authenticated users
- ✅ **Schema Retrieval - Anonymous**: Returns schema for anonymous access
- ❌ **Invalid Form ID**: Returns 400 for invalid form identifiers
- ❌ **Schema Not Found**: Returns 404 for non-existent schemas

### POST /api/forms
**Purpose**: Create new form with authenticated user as owner

**Test Scenarios**:
- ✅ **Valid Form Creation**: Creates form with proper validation
- ❌ **Validation Errors**: Returns 400 for invalid form data (empty name, etc.)
- ❌ **Unauthenticated Creation**: Returns 401 for missing authentication
- ❌ **Database Errors**: Returns 500 for creation failures

**Validation Rules**:
- Name is required (minimum 1 character)
- Description is optional
- isPublic defaults to true
- Schema is optional

### PATCH /api/forms/:id
**Purpose**: Update form metadata with ownership verification

**Test Scenarios**:
- ✅ **Successful Update**: Updates form with valid data and ownership
- ❌ **Invalid Form ID**: Returns 400 for non-numeric identifiers
- ❌ **Validation Errors**: Returns 400 for invalid update data
- ❌ **Unauthenticated Update**: Returns 401 for missing authentication
- ❌ **Ownership Check**: Returns 404 for forms user doesn't own
- ❌ **Database Errors**: Returns 500 for update failures

---

## 3. Version Routes (`/api/forms/:formId/versions`)

### GET /api/forms/:formId/versions
**Purpose**: Retrieve all versions for a specific form

**Test Scenarios**:
- ✅ **Version History**: Returns complete version history with metadata
- ❌ **Invalid Form ID**: Returns 400 for non-numeric form identifiers
- ❌ **Unauthenticated Access**: Returns 401 for missing authentication
- ❌ **Form Access Denied**: Returns 404 for unauthorized form access
- ❌ **Database Errors**: Returns 500 for query failures

### GET /api/forms/:formId/versions/:sha
**Purpose**: Retrieve specific version by SHA identifier

**Test Scenarios**:
- ✅ **Version Retrieval**: Returns specific version with full schema data
- ❌ **Invalid Form ID**: Returns 400 for invalid form identifiers
- ❌ **Missing Version SHA**: Returns 400 for empty SHA parameters
- ❌ **Version Not Found**: Returns 404 for non-existent versions
- ❌ **Database Errors**: Returns 500 for retrieval failures

### POST /api/forms/:formId/versions
**Purpose**: Create new version of a form

**Test Scenarios**:
- ✅ **Full Version Creation**: Creates version with all optional parameters
- ✅ **Minimal Version Creation**: Creates version with minimal required data
- ❌ **Invalid Form ID**: Returns 400 for invalid form identifiers
- ❌ **Unauthenticated Creation**: Returns 401 for missing authentication
- ❌ **Form Access Denied**: Returns 404 for unauthorized access
- ❌ **Database Errors**: Returns 500 for creation failures

**Version Creation Options**:
- Description (optional)
- Schema (optional - server determines base schema)
- Publish flag (defaults to false)
- Base version SHA (optional for copying existing schema)

### PATCH /api/forms/:formId/versions/:sha
**Purpose**: Update existing version metadata and schema

**Test Scenarios**:
- ✅ **Version Update**: Updates version description and schema
- ❌ **Invalid Form ID**: Returns 400 for invalid identifiers
- ❌ **Missing Version SHA**: Returns 400 for empty SHA parameters
- ❌ **Database Errors**: Returns 500 for update failures

### POST /api/forms/:formId/versions/:sha/revert
**Purpose**: Create new version by reverting to a specific previous version

**Test Scenarios**:
- ✅ **Version Revert with Description**: Creates new version from previous state
- ✅ **Version Revert Minimal**: Reverts without custom description
- ❌ **Invalid Form ID**: Returns 400 for invalid form identifiers
- ❌ **Unauthenticated Revert**: Returns 401 for missing authentication
- ❌ **Form Access Denied**: Returns 404 for unauthorized access
- ❌ **Database Errors**: Returns 500 for revert failures

---

## 4. Submission Routes (`/api/submissions`)

### GET /api/submissions/:id
**Purpose**: Retrieve submission data with access control

**Test Scenarios**:
- ✅ **Form Owner Access**: Returns submission data for form owners
- ✅ **Anonymous Token Access**: Returns data for valid anonymous tokens
- ❌ **Invalid Submission ID**: Returns 400 for non-numeric identifiers
- ❌ **Submission Not Found**: Returns 404 for non-existent submissions
- ❌ **Anonymous Without Token**: Returns 403 for unauthorized anonymous access
- ❌ **Database Errors**: Returns 500 for retrieval failures

**Access Control**:
- Form owners can access all submissions
- Submission creators can access their own submissions
- Anonymous users need valid submission tokens

### GET /api/submissions/form/:formId
**Purpose**: Retrieve all submissions for a specific form (form owner only)

**Test Scenarios**:
- ✅ **Form Owner Submission List**: Returns all submissions for owned forms
- ❌ **Invalid Form ID**: Returns 400 for invalid form identifiers
- ❌ **Unauthenticated Access**: Returns 401 for missing authentication
- ❌ **Form Access Denied**: Returns 404 for unauthorized form access
- ❌ **Database Errors**: Returns 500 for query failures

### POST /api/submissions/form/:formId
**Purpose**: Create new submission for a form (public endpoint with optional auth)

**Test Scenarios**:
- ✅ **Authenticated Public Form**: Creates submission for authenticated users
- ✅ **Anonymous Public Form**: Creates submission with anonymous token generation
- ✅ **Authenticated Private Form**: Creates submission for form owner on private forms
- ❌ **Anonymous Private Form**: Returns 401 for anonymous access to private forms
- ❌ **Validation Errors**: Returns 400 for invalid submission data
- ❌ **Form Not Found**: Returns 404 for non-existent forms
- ❌ **Database Errors**: Returns 500 for creation failures

**Submission Validation**:
- FormId must be numeric
- VersionSha must be valid string
- Data can be any JSON object

**Access Rules**:
- Public forms: accessible to anyone
- Private forms: require authentication
- Anonymous submissions get unique access tokens

---

## 5. Settings Routes (`/api/settings`)

### GET /api/settings/profile
**Purpose**: Retrieve current user's profile information

**Test Scenarios**:
- ✅ **Profile Retrieval**: Returns safe user data for authenticated users
- ❌ **Unauthenticated Access**: Returns 401 for missing authentication
- ❌ **User Not Found**: Returns 404 for non-existent users
- ❌ **Database Errors**: Returns 500 for retrieval failures

### PATCH /api/settings/profile
**Purpose**: Update user profile information (name and email)

**Test Scenarios**:
- ✅ **Full Profile Update**: Updates name and email successfully
- ✅ **Name Only Update**: Updates only name field
- ❌ **Empty Name Validation**: Returns 400 for empty name values
- ❌ **Invalid Email Validation**: Returns 400 for malformed email addresses
- ❌ **Unauthenticated Update**: Returns 401 for missing authentication
- ❌ **Database Errors**: Returns 500 for update failures

**Profile Validation Rules**:
- Name is required (minimum 1 character)
- Email is optional but must be valid format if provided

### DELETE /api/settings/profile
**Purpose**: Permanently delete user account and all associated data

**Test Scenarios**:
- ✅ **Account Deletion**: Successfully deletes user account
- ❌ **Unauthenticated Deletion**: Returns 401 for missing authentication
- ❌ **Database Errors**: Returns 500 for deletion failures

**Data Deletion Impact**:
- Removes user account permanently
- Cascades to delete all user forms
- Cascades to delete all form versions
- Anonymizes existing submissions (sets createdBy to null)

---

## Running Tests

### Execute All Tests
```bash
npm test
```

### Execute Specific Test Suites
```bash
npm test -- auth.test.ts        # Authentication tests only
npm test -- forms.test.ts       # Forms tests only
npm test -- versions.test.ts    # Versions tests only
npm test -- submissions.test.ts # Submissions tests only
npm test -- settings.test.ts    # Settings tests only
```

### Execute with Coverage
```bash
npm run test:coverage
```

### Watch Mode for Development
```bash
npm run test:watch
```

## Coverage Goals

The test suite aims for comprehensive coverage:
- **Route Coverage**: 100% of API endpoints tested
- **Scenario Coverage**: Success, validation, authentication, and error scenarios
- **Edge Case Coverage**: Invalid inputs, missing parameters, database failures
- **Authorization Coverage**: User permissions and access control

## Testing Patterns

### 1. Arrange-Act-Assert Pattern
Each test follows the clear AAA pattern:
```typescript
it('should create new form successfully', async () => {
  // Arrange
  const formData = { name: 'Test Form', isPublic: true };
  mockFormsService.createForm.mockResolvedValue([createdForm]);

  // Act
  const response = await app.request('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(formData),
  });

  // Assert
  expect(response.status).toBe(201);
  expect(mockFormsService.createForm).toHaveBeenCalledWith(/* ... */);
});
```

### 2. Mock Isolation
Each test uses isolated mocks to prevent test interference:
- Database operations are fully mocked
- External services (GitHub OAuth) are mocked
- Authentication middleware is mocked consistently

### 3. Error Scenario Testing
Every endpoint tests multiple error conditions:
- Invalid input validation
- Authentication failures
- Authorization failures
- Database/service failures
- Missing parameters

### 4. Data Validation Testing
Form data validation is thoroughly tested:
- Required field validation
- Data type validation
- Format validation (email, etc.)
- Business rule validation

## Benefits of This Test Suite

1. **Regression Prevention**: Catches breaking changes before deployment
2. **Documentation**: Tests serve as living documentation of API behavior
3. **Confidence**: Enables safe refactoring and feature development
4. **Quality Assurance**: Ensures consistent error handling and validation
5. **Development Speed**: Rapid feedback during development cycles

## Future Enhancements

1. **Integration Tests**: Add tests with real database connections
2. **Performance Tests**: Add response time and load testing
3. **Contract Tests**: Add API contract validation
4. **End-to-End Tests**: Add full workflow testing across multiple endpoints
5. **Security Tests**: Add specific security vulnerability testing

This comprehensive test suite provides a solid foundation for maintaining code quality and ensuring the DevelForm API behaves correctly across all scenarios and edge cases.