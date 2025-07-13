# Google OAuth2 Setup Guide

This guide walks you through obtaining Google Client ID and Client Secret from the Google Cloud Console for OAuth2 authentication.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Basic understanding of OAuth2 concepts

## Step-by-Step Instructions

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project, create one first (see [Project Setup](#project-setup))

### 2. Enable Required APIs

Before setting up OAuth2, ensure you have the necessary APIs enabled:

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Google+ API** (for user profile information)
   - **Cloud Text-to-Speech API** (for TTS functionality)

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

**Scopes (Step 2):**
- For this app, default scopes are sufficient
- Click **SAVE AND CONTINUE**

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
```

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

4. **"API not enabled" error**:
   - Enable Google+ API in APIs & Services > Library
   - Wait a few minutes after enabling

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

## Testing Your Setup

1. Start your application: `npm start`
2. Go to `http://localhost:3000`
3. Click "Sign in with Google"
4. You should be redirected to Google's OAuth screen
5. After authorization, you should be redirected back to your app

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

---

**Note**: This guide assumes you're setting up for development. Additional steps may be required for production deployment, including app verification for public use. 