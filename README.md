# Google Cloud Text-to-Speech Web UI

A modern web application for converting text to speech using Google Cloud Text-to-Speech API with OAuth2 authentication. This application uses only **standard voices** to keep costs low.

## Features

- 🎯 **OAuth2 Authentication** - Sign in with Google (no service accounts needed!)
- 🎙️ **Standard Voices Only** - Cost-effective voice selection
- 🌍 **Multiple Languages** - Support for 40+ languages
- 🎵 **Native Audio Playback** - Uses browser's built-in audio controls
- 📱 **Responsive Design** - Works on desktop and mobile
- 💾 **Audio Download** - Download generated speech as MP3
- ⚡ **Real-time Validation** - Character count and form validation
- 🔐 **User-Based API Access** - All API calls made on behalf of the authenticated user

## Prerequisites

- Node.js (v14 or higher)
- Google Cloud Project with Text-to-Speech API enabled
- Google OAuth2 credentials (no service account needed!)

## Quick Start

🚀 **New to setup?** Follow the step-by-step checklist: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

## Setup Instructions

### 1. Google Cloud Setup

**Simplified Setup - OAuth2 Only!**

1. **OAuth2 Credentials** (for user authentication and API access)
   - 📋 **Follow the detailed guide**: [OAUTH_GUIDE.md](OAUTH_GUIDE.md)
   - This allows users to sign in and the app to make API calls on their behalf

**Quick Summary:**
- Enable Text-to-Speech API in your Google Cloud project
- Set up OAuth2 credentials with proper redirect URIs and scopes
- Configure the OAuth consent screen
- No service account needed - everything runs on behalf of the user!

### 2. Application Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd gcp-tts-webui
   npm install
   ```

2. **Configure Environment**
   
   **Option A: Using .env file (Recommended)**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   PORT=3000
   SESSION_SECRET=your-strong-session-secret-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   NODE_ENV=development
   ```
   
   **Option B: Using config.js**
   ```bash
   cp config.example.js config.js
   ```
   
   Edit `config.js` with your credentials:
   ```javascript
   module.exports = {
     port: process.env.PORT || 3000,
     sessionSecret: 'your-strong-session-secret-here',
     
     google: {
       clientId: 'your-google-client-id',
       clientSecret: 'your-google-client-secret',
       projectId: 'your-google-cloud-project-id'
     },
     
     nodeEnv: process.env.NODE_ENV || 'development'
   };
   ```

3. **Verify Google Cloud Project**
   - Ensure your Google Cloud project ID is correct in the configuration
   - Make sure the Text-to-Speech API is enabled in your project

### 3. Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Mode**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - Click "Sign in with Google"
   - Select a language and voice
   - Enter text and generate speech!

## Usage

1. **Authentication**: Click "Sign in with Google" to authenticate
2. **Select Language**: Choose from 40+ supported languages
3. **Choose Voice**: Select from available standard voices for your language
4. **Enter Text**: Type or paste text (up to 50,000 characters)
5. **Generate Speech**: Click "Generate Speech" to create audio
6. **Play Audio**: Use the built-in audio controls to play the generated speech
7. **Download**: Click "Download" to save the audio file

## Voice Types

This application uses only **standard voices** to keep costs low:
- ✅ Standard voices (included)
- ❌ WaveNet voices (excluded)
- ❌ Neural2 voices (excluded)
- ❌ Journey voices (excluded)
- ❌ Studio voices (excluded)

## Cost Considerations

- Standard voices: $4.00 per 1 million characters
- Character limit: 50,000 characters per request
- No data storage costs (audio generated on-demand)

## Supported Languages

The application supports 40+ languages including:
- English (US, UK, Australia, India)
- Spanish (Spain, US)
- French (France, Canada)
- German, Italian, Japanese, Korean
- Chinese (Simplified, Traditional)
- Portuguese (Brazil, Portugal)
- And many more...

## Security

- OAuth2 authentication with Google
- Session-based authentication
- No API keys exposed to frontend
- User-based API access (no service account credentials needed)
- All API calls made on behalf of the authenticated user

## Deployment

### Environment Variables (Production)
```bash
PORT=3000
SESSION_SECRET=your-strong-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CLOUD_PROJECT_ID=your-project-id
NODE_ENV=production
```

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Check OAuth2 credentials and redirect URIs
   - Ensure the domain matches your OAuth2 configuration

2. **API Errors**
   - Verify Text-to-Speech API is enabled
   - Check OAuth2 permissions and scopes
   - Ensure user has access to the Google Cloud project

3. **Voice Loading Issues**
   - Confirm OAuth2 includes Text-to-Speech API scope
   - Check project ID in configuration
   - Verify user has necessary permissions

4. **Audio Playback Issues**
   - Ensure browser supports MP3 audio
   - Check browser's audio permissions

## Development

### Project Structure
```
gcp-tts-webui/
├── public/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # CSS styles
│   └── app.js               # Frontend JavaScript
├── server.js                # Express server
├── config.example.js        # Configuration template
├── env.example              # Environment variables template
├── package.json             # Dependencies
├── .gitignore               # Git ignore file
├── README.md               # Main documentation
├── SETUP_CHECKLIST.md      # Step-by-step setup checklist
└── OAUTH_GUIDE.md          # Complete OAuth2 setup and troubleshooting guide
```

### API Endpoints
- `GET /` - Main application
- `GET /auth/google` - Google OAuth2 login
- `GET /auth/google/callback` - OAuth2 callback
- `GET /auth/logout` - Logout
- `GET /api/user` - Get current user
- `GET /api/voices` - Get available voices
- `POST /api/synthesize` - Generate speech

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Cloud documentation
3. Create an issue in the repository

---

**Note**: This application is designed for development and light usage. For production use with high traffic, consider implementing rate limiting, caching, and proper error handling.

https://cloud.google.com/text-to-speech/quotas describes there is 5k bytes per single request.

https://cloud.google.com/text-to-speech/docs/list-voices-and-types#list_of_all_supported_languages lists all available languages and models.
For czech, there is only standard and wavenet, which sound both the same.

LongAudio can synthesize longer audio https://cloud.google.com/text-to-speech/docs/create-audio-text-long-audio-synthesis