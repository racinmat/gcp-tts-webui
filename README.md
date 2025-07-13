# Google Cloud Text-to-Speech Web UI

A modern web application for converting text to speech using Google Cloud Text-to-Speech API with OAuth2 authentication. This application uses only **standard voices** to keep costs low.

## Features

- 🎯 **OAuth2 Authentication** - Sign in with Google (no API keys needed for users)
- 🎙️ **Standard Voices Only** - Cost-effective voice selection
- 🌍 **Multiple Languages** - Support for 40+ languages
- 🎵 **Native Audio Playback** - Uses browser's built-in audio controls
- 📱 **Responsive Design** - Works on desktop and mobile
- 💾 **Audio Download** - Download generated speech as MP3
- ⚡ **Real-time Validation** - Character count and form validation

## Prerequisites

- Node.js (v14 or higher)
- Google Cloud Project with Text-to-Speech API enabled
- Google OAuth2 credentials

## Quick Start

🚀 **New to setup?** Follow the step-by-step checklist: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

## Setup Instructions

### 1. Google Cloud Setup

You'll need to set up two main components in Google Cloud:

1. **Service Account** (for Text-to-Speech API access)
   - 📋 **Follow the detailed guide**: [SERVICE_ACCOUNT_GUIDE.md](SERVICE_ACCOUNT_GUIDE.md)
   - This provides your app with API access to generate speech

2. **OAuth2 Credentials** (for user authentication)
   - 📋 **Follow the detailed guide**: [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)
   - This allows users to sign in with their Google accounts

**Quick Summary:**
- Enable Text-to-Speech API in your Google Cloud project
- Create a service account with "Cloud Text-to-Speech Client" role
- Download the service account JSON key file
- Set up OAuth2 credentials with proper redirect URIs
- Configure the OAuth consent screen

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
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
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

3. **Set up Google Cloud Credentials**
   - Place your service account JSON file in the project root
   - Set the environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
     ```

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
4. **Enter Text**: Type or paste text (up to 5,000 characters)
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
- Character limit: 5,000 characters per request
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
- Service account credentials for backend API calls

## Deployment

### Environment Variables (Production)
```bash
PORT=3000
SESSION_SECRET=your-strong-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
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
   - Check service account permissions
   - Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly

3. **Voice Loading Issues**
   - Confirm service account has "Cloud Text-to-Speech Client" role
   - Check project ID in configuration

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
├── OAUTH_SETUP_GUIDE.md    # OAuth2 credentials setup guide
└── SERVICE_ACCOUNT_GUIDE.md # Service account setup guide
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