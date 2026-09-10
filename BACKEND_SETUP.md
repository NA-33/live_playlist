## Backend & Database Setup for Terms Acceptance

To enable terms enforcement on the backend, follow these steps:

### 1. Create the User Profiles Table

Run this SQL in your Supabase SQL Editor to create the user_profiles table:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_accepted_at TIMESTAMPTZ,
  privacy_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- User can only modify their own profile
CREATE POLICY "Users can modify their own profile" 
ON user_profiles FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### 2. Backend Flow

The backend now has three new features:

#### a. Accept Terms Endpoint
- **POST** `/api/auth/accept-terms`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "user_id": "<uuid>" }`
- **Response**: Confirms terms acceptance and stores timestamp

#### b. Check Terms Endpoint
- **GET** `/api/auth/check-terms/:user_id`
- **Response**: Returns whether user has accepted terms

#### c. Track Addition Protection
- **POST** `/api/tracks` now checks if user has accepted terms before allowing track additions
- Non-authenticated users can still add tracks to public playlists
- Authenticated users must have accepted terms to add tracks

### 3. Frontend Integration

The login page now:
- Shows a checkbox only during sign-up requiring terms acceptance
- Links to `/terms` and `/privacy` pages
- Prevents sign-up without checking the checkbox
- Sends `accept-terms` request to backend after successful sign-up
- Requires terms acceptance for Google OAuth sign-up flow

### 4. Environment Variables

Make sure your backend has access to:
- `DATABASE_URL` - PostgreSQL connection string (from Supabase)
- `PORT` - Backend server port (default: 4000)

### 5. Testing

1. **Sign Up Flow**:
   - Navigate to login page
   - Click "Sign Up"
   - Try to sign up without checking terms → should be blocked
   - Check terms and privacy checkbox
   - Complete sign up → terms acceptance stored in DB

2. **Track Addition**:
   - After sign up, try to add a track
   - Backend verifies terms acceptance before allowing

3. **Check Terms Status**:
   - Call `/api/auth/check-terms/<user_id>` to verify

### 6. Migration Notes

- Existing users won't have terms accepted automatically
- They will need to accept terms on their next login or action
- Consider adding a modal prompt for existing users to accept terms

### 7. Production Checklist

- [ ] Run SQL migration in Supabase
- [ ] Deploy backend with new endpoints
- [ ] Deploy frontend with updated login page
- [ ] Test full authentication flow
- [ ] Verify terms enforcement on track additions
- [ ] Monitor error logs for terms-related issues
- [ ] Set up user communication about new terms requirement
