// Copy this file to config.js and fill in your actual values
// Or use environment variables (recommended for production)
module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-key-here',
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id-here',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id-here'
  },
  
  nodeEnv: process.env.NODE_ENV || 'development'
}; 