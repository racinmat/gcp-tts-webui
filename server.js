const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config();

// Load configuration
let config;
try {
  config = require('./config');
} catch (err) {
  console.error('Configuration file not found. Please copy config.example.js to config.js and fill in your credentials.');
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth2 Strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Store the access token with the profile for API calls
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Function to make authenticated requests to Text-to-Speech API
function createTTSApiClient(accessToken) {
  return axios.create({
    baseURL: 'https://texttospeech.googleapis.com/v1',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

// Authentication middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication routes
app.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/cloud-platform'] 
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// API routes
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails[0].value
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Get available voices (standard voices only)
app.get('/api/voices', ensureAuthenticated, async (req, res) => {
  try {
    const apiClient = createTTSApiClient(req.user.accessToken);
    const response = await apiClient.get('/voices');
    
    // Filter for standard voices only (exclude WaveNet, Neural2, etc.)
    const standardVoices = response.data.voices.filter(voice => 
      !voice.name.includes('Wavenet') && 
      !voice.name.includes('Neural2') && 
      !voice.name.includes('Journey') &&
      !voice.name.includes('Studio')
    );
    
    res.json(standardVoices);
  } catch (error) {
    console.error('Error fetching voices:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Authentication failed. Please log out and log back in.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch voices. Please try logging out and logging back in.' });
    }
  }
});

// Text-to-speech conversion
app.post('/api/synthesize', ensureAuthenticated, async (req, res) => {
  try {
    const { text, voice, languageCode } = req.body;
    
    if (!text || !voice || !languageCode) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 50,000 characters' });
    }
    
    // Create API client with user's access token
    const apiClient = createTTSApiClient(req.user.accessToken);
    
    // Construct the request
    const requestData = {
      input: { text: text },
      voice: {
        languageCode: languageCode,
        name: voice
      },
      audioConfig: { audioEncoding: 'MP3' }
    };
    
    console.log('Sending TTS request:', {
      textLength: text.length,
      voice: voice,
      languageCode: languageCode
    });
    
    // Perform the text-to-speech request
    const response = await apiClient.post('/text:synthesize', requestData);
    
    res.json({
      success: true,
      audioContent: response.data.audioContent,
      contentType: 'audio/mp3'
    });
    
  } catch (error) {
    console.error('Error synthesizing speech:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Authentication failed. Please log out and log back in.' });
    } else if (error.response?.status === 400) {
      const errorMsg = error.response.data?.error?.message || 'Bad request - please check your input';
      res.status(400).json({ error: errorMsg });
    } else {
      res.status(500).json({ error: 'Failed to synthesize speech. Please try logging out and logging back in.' });
    }
  }
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to:');
  console.log('1. Set up Google Cloud credentials');
  console.log('2. Configure OAuth2 in Google Cloud Console');
  console.log('3. Copy config.example.js to config.js and fill in your credentials');
}); 