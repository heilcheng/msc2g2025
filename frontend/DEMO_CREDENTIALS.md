# Demo Authentication Credentials

For testing the authentication system, you can use these mock credentials:

## Test Users

### User 1 - Parent Account
- **Email**: `parent@example.com`
- **Phone**: `+852 9876 5432`
- **Username**: `emma_parent`
- **Password**: `password123`

### User 2 - Test User
- **Email**: `test@example.com`
- **Username**: `testuser`
- **Password**: `test123`

### User 3 - Volunteer Account
- **Email**: `volunteer@example.com`
- **Username**: `volunteer_user`
- **Password**: `volunteer123`

## Sign In Methods

You can sign in using any of the following identifiers:
- Email address
- Phone number (for User 1 only)
- Username

## Sign Up Options

1. **Email Sign Up**: Enter any valid email format
2. **Phone Sign Up**: Enter any phone number format
3. **Invitation Code**: Enter any code (validation is mocked)

After choosing a sign-up method, you'll be prompted to create a username and password.

## Google SSO

The Google Sign-in button is fully functional and creates a mock Google user account.

## Route Protection

- All pages except `/login`, `/signup`, and `/forgot-password` require authentication
- Unauthenticated users are automatically redirected to `/login`
- Authenticated users trying to access auth pages are redirected to `/dashboard`

## Features

- Persistent authentication (uses localStorage for demo)
- User menu with logout functionality
- Error handling for invalid credentials
- Loading states during authentication
- Password visibility toggles
- Form validation

## Notes

This is a demonstration system with mock authentication. In a production environment:
- Use secure token-based authentication
- Implement proper password hashing
- Use HTTPS for all auth operations
- Validate tokens server-side
- Implement proper session management
