# Setup Checklist

Use this checklist to ensure you have everything configured properly for the Text-to-Speech Web UI.

## ✅ Prerequisites

- [ ] Node.js (v14 or higher) installed
- [ ] Google account with access to Google Cloud Console
- [ ] Basic understanding of command line operations

## ✅ Google Cloud Setup

### OAuth2 Credentials (for user authentication and API access)
- [ ] Google Cloud project created
- [ ] Billing enabled on your project
- [ ] Text-to-Speech API enabled
- [ ] OAuth consent screen configured
- [ ] Required scopes added (cloud-platform, profile, email)
- [ ] Test users added (including your email)
- [ ] OAuth2 client ID created
- [ ] Redirect URIs configured correctly:
  - `http://localhost:3000/auth/google/callback`
- [ ] Client ID and Client Secret obtained

📋 **Detailed guide**: [OAUTH_GUIDE.md](OAUTH_GUIDE.md)

## ✅ Application Setup

### Installation
- [ ] Repository cloned/downloaded
- [ ] Dependencies installed with `npm install`
- [ ] Environment variables configured (see below)

### Environment Configuration
Choose one of these options:

**Option A: Using .env file (Recommended)**
- [ ] Copied `env.example` to `.env`
- [ ] Updated `.env` with your credentials:
  ```env
  PORT=3000
  SESSION_SECRET=your-strong-random-secret
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret
  GOOGLE_CLOUD_PROJECT_ID=your-project-id
  NODE_ENV=development
  ```

**Option B: Using config.js**
- [ ] Copied `config.example.js` to `config.js`
- [ ] Updated `config.js` with your credentials

## ✅ Testing Your Setup

### Quick Test
- [ ] Run `npm start` or `npm run dev`
- [ ] Open `http://localhost:3000` in your browser
- [ ] Click "Sign in with Google" 
- [ ] Successfully authenticate with Google
- [ ] See language/voice selection dropdowns populate
- [ ] Enter test text and generate speech
- [ ] Audio plays successfully in browser

### Troubleshooting
If something doesn't work:
- [ ] Check console logs for error messages
- [ ] Verify all environment variables are set correctly
- [ ] Confirm OAuth2 redirect URIs match exactly
- [ ] Check that APIs are enabled in Google Cloud Console
- [ ] Verify OAuth2 scopes include cloud-platform scope

## ✅ Security Verification

- [ ] `.env` file is in `.gitignore` 
- [ ] No credentials are hardcoded in source files
- [ ] OAuth2 redirect URIs only include necessary domains
- [ ] Session secret is strong and unique
- [ ] OAuth2 scopes are minimal and necessary

## ✅ Production Deployment (Optional)

If deploying to production:
- [ ] Update OAuth2 redirect URIs with production domain
- [ ] Set environment variables on production server
- [ ] Use HTTPS in production
- [ ] Update OAuth consent screen with production URLs
- [ ] Consider using managed secret storage

## Common File Locations

After setup, your project should look like:
```
gcp-tts-webui/
├── .env                          # Your environment variables
├── config.js                     # Your config file (if using Option B)
└── ... (other project files)
```

## Need Help?

1. **OAuth2 Issues**: Check [OAUTH_GUIDE.md](OAUTH_GUIDE.md) troubleshooting section
2. **Application Issues**: Check [README.md](README.md) troubleshooting section

## Success! 🎉

When everything is working:
- Users can sign in with Google OAuth2
- Voice selection shows available standard voices
- Text-to-speech generation works
- Audio plays in the browser
- Download functionality works

Your Text-to-Speech web application is ready to use! 