# Google OAuth2 Complete Guide

## Overview

This application uses **OAuth-only authentication**, eliminating the need for service accounts. All Text-to-Speech API calls are made on behalf of the authenticated user, providing a simpler and more secure setup.

## What Makes This Different

### ✅ **Simplified Setup Process**
- **No service accounts needed!**
- **No JSON key files to manage**
- **Single OAuth2 setup handles both authentication and API access**

### 🔧 **How It Works**
- Users authenticate with Google OAuth2
- The app receives an access token with Text-to-Speech API permissions
- All API calls are made using the user's credentials
- No backend service account credentials required

## Prerequisites

- Google account
- Access to Google Cloud Console
- Basic understanding of OAuth2 concepts

## Step-by-Step Setup

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project, create one first (see [Project Setup](#project-setup))

### 2. Enable Required APIs

Before setting up OAuth2, ensure you have the necessary APIs enabled:

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Cloud Text-to-Speech API** (for TTS functionality)
   - **Google+ API** (for user profile information - optional)

### 3. Configure OAuth Consent Screen

This is **required** before creating OAuth2 credentials:

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you're using Google Workspace)
3. Click **CREATE**

#### Fill in OAuth Consent Screen Information:

**App Information:**
- **App name**: `Text-to-Speech Web App` (or your preferred name)
- **User support email**: Your email address
- **App logo**: Optional, but recommended

**App domain information:**
- **Application home page**: `http://localhost:3000` (for development)
- **Application privacy policy link**: Optional for development
- **Application terms of service link**: Optional for development

**Developer contact information:**
- **Email addresses**: Your email address

4. Click **SAVE AND CONTINUE**

**Scopes (Step 2) - IMPORTANT:**
- Click **ADD OR REMOVE SCOPES**
- Add the following scopes:
  - `https://www.googleapis.com/auth/cloud-platform` (for Text-to-Speech API)
  - `profile` (for user profile information)
  - `email` (for user email)
- Click **UPDATE** and then **SAVE AND CONTINUE**

**Test users (Step 3):**
- Add email addresses of users who can test your app
- Include your own email address
- Click **SAVE AND CONTINUE**

5. Review the summary and click **BACK TO DASHBOARD**

### 4. Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **OAuth 2.0 Client ID**

#### Configure OAuth2 Client:

1. **Application type**: Select **Web application**

2. **Name**: Enter a descriptive name (e.g., "TTS Web App OAuth Client")

3. **Authorized JavaScript origins**: Add these URLs:
   ```
   http://localhost:3000
   https://localhost:3000
   ```
   *Note: Add your production domain when deploying*

4. **Authorized redirect URIs**: Add these URLs:
   ```
   http://localhost:3000/auth/google/callback
   https://localhost:3000/auth/google/callback
   ```
   *Note: Add your production callback URL when deploying*

5. Click **CREATE**

### 5. Download and Save Credentials

After creating the OAuth2 client:

1. A dialog will appear with your credentials
2. **Copy the Client ID** - This is your `GOOGLE_CLIENT_ID`
3. **Copy the Client Secret** - This is your `GOOGLE_CLIENT_SECRET`
4. Click **DOWNLOAD JSON** to save the credentials file (optional but recommended)

### 6. Update Your Environment Variables

Add the credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
```

## Required OAuth2 Scopes

The application requires these OAuth2 scopes:
- `profile` - For user profile information
- `email` - For user email address
- `https://www.googleapis.com/auth/cloud-platform` - For Text-to-Speech API access

## Project Setup

If you don't have a Google Cloud project:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project selector at the top
3. Click **NEW PROJECT**
4. Enter project details:
   - **Project name**: `tts-web-app` (or your preferred name)
   - **Location**: Leave as default or select your organization
5. Click **CREATE**
6. Wait for the project to be created and select it

## Production Deployment

When deploying to production:

1. **Update OAuth2 Client Settings**:
   - Go to **APIs & Services** > **Credentials**
   - Click on your OAuth2 client
   - Add your production domain to:
     - **Authorized JavaScript origins**: `https://yourdomain.com`
     - **Authorized redirect URIs**: `https://yourdomain.com/auth/google/callback`

2. **Update OAuth Consent Screen**:
   - Change **Application home page** to your production URL
   - Add proper privacy policy and terms of service links
   - Submit for verification if needed

## Testing Your Setup

1. Start your application: `npm start`
2. Go to `http://localhost:3000`
3. Click "Sign in with Google"
4. You should be redirected to Google's OAuth screen
5. **Important**: You'll be prompted to grant permissions for Text-to-Speech API access
6. After authorization, you should be redirected back to your app
7. Voice selection should populate with available voices

## Benefits of OAuth-Only Approach

### 🎯 **Simplified Setup**
- One less credential type to manage
- No JSON key files to secure
- Fewer configuration steps

### 🔐 **Enhanced Security**
- No service account keys to rotate
- User-based permissions and access control
- OAuth token management handled by Google

### 👥 **Better User Experience**
- Users authenticate once and get immediate access
- No need to share service account permissions
- Natural user-based quota and billing

## Troubleshooting

### Common Issues:

1. **"Access blocked" error**:
   - Ensure your app is added to test users in OAuth consent screen
   - Check that redirect URIs match exactly (including protocol)

2. **"Invalid client" error**:
   - Verify Client ID and Client Secret are correct
   - Check that the callback URL matches your configuration

3. **"Consent screen not configured"**:
   - Complete the OAuth consent screen setup first
   - Ensure all required fields are filled

4. **"Insufficient Permission" errors**:
   - Verify the `cloud-platform` scope is included in OAuth2 configuration
   - Check that the user has access to the Google Cloud project
   - Ensure Text-to-Speech API is enabled

5. **"API not enabled" error**:
   - Enable Text-to-Speech API in APIs & Services > Library
   - Wait a few minutes after enabling

6. **Voice loading fails**:
   - Verify user has appropriate permissions in the Google Cloud project
   - Check console logs for detailed error messages
   - Ensure project ID is correct in configuration

### Security Best Practices:

1. **Keep credentials secure**:
   - Never commit Client Secret to version control
   - Use environment variables for credentials
   - Rotate credentials periodically

2. **Restrict domains**:
   - Only add necessary domains to authorized origins
   - Use HTTPS in production
   - Validate redirect URIs carefully

3. **Monitor usage**:
   - Check API usage in Cloud Console
   - Set up billing alerts
   - Monitor for unusual activity

## Migration from Service Account Setup

If you're migrating from a service account setup:

### For Existing Installations
1. **Update your `.env` file**:
   ```env
   # Remove this line:
   # GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
   ```

2. **Update OAuth2 Scopes**:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your OAuth2 client
   - Add the scope: `https://www.googleapis.com/auth/cloud-platform`

3. **Clear existing sessions**: Users may need to log out and log back in

4. **Remove service account files** from your project

## Security Considerations

### Advantages
- ✅ No service account keys to manage or rotate
- ✅ User-based access control
- ✅ OAuth token refresh handled automatically
- ✅ Permissions tied to user's Google Cloud access

### Considerations
- ℹ️ Users need appropriate Google Cloud project permissions
- ℹ️ API quotas and billing tied to user's project access
- ℹ️ OAuth tokens have limited lifetime (handled automatically)

## Additional Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud APIs](https://cloud.google.com/apis/)
- [OAuth Consent Screen Guide](https://developers.google.com/identity/oauth2/web/guides/migration)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Verify all URLs and credentials are correct
4. Check that APIs are enabled and billing is set up
5. Ensure OAuth2 scopes include the `cloud-platform` scope

---

**Result**: A simpler, more secure application that's easier to set up and maintain! 🎉

**Note**: This guide assumes you're setting up for development. Additional steps may be required for production deployment, including app verification for public use. 