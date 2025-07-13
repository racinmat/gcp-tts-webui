# Google Cloud Service Account Setup Guide

This guide walks you through creating and configuring a Google Cloud service account for the Text-to-Speech API.

## Prerequisites

- Google Cloud project with billing enabled
- Access to Google Cloud Console
- Basic understanding of Google Cloud IAM

## Step-by-Step Instructions

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create one if needed)

### 2. Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Search for and enable:
   - **Cloud Text-to-Speech API**
   - **Cloud Resource Manager API** (usually enabled by default)

### 3. Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Fill in the service account details:
   - **Service account name**: `tts-web-app-sa` (or your preferred name)
   - **Service account ID**: Will be auto-generated based on the name
   - **Description**: `Service account for Text-to-Speech web application`
4. Click **CREATE AND CONTINUE**

### 4. Grant Required Permissions

On the "Grant this service account access to project" step:

1. Click **Select a role** dropdown
2. Search for and select: **Cloud Text-to-Speech Client**
3. Click **ADD ANOTHER ROLE** (optional, for additional permissions)
4. For enhanced security, you can also add: **Cloud Text-to-Speech User**
5. Click **CONTINUE**

### 5. Grant User Access (Optional)

On the "Grant users access to this service account" step:
- This is optional for this application
- You can skip this step by clicking **DONE**

### 6. Generate and Download Key File

1. Back on the **Service Accounts** page, find your newly created service account
2. Click on the **Actions** menu (three dots) next to your service account
3. Select **Manage keys**
4. Click **ADD KEY** > **Create new key**
5. Select **JSON** as the key type
6. Click **CREATE**
7. The key file will be automatically downloaded to your computer

### 7. Secure Your Key File

**Important Security Steps:**

1. **Rename the file** to something memorable (e.g., `tts-service-account-key.json`)
2. **Move the file** to your project directory
3. **Never commit this file** to version control (it should be in your `.gitignore`)
4. **Set appropriate file permissions** (read-only for your user)

### 8. Configure Environment Variables

Add the path to your key file in your `.env` file:

```env
GOOGLE_APPLICATION_CREDENTIALS=./tts-service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
```

**Alternative:** You can also set the full path:
```env
GOOGLE_APPLICATION_CREDENTIALS=/full/path/to/tts-service-account-key.json
```

### 9. Test the Setup

You can test if your service account is working by running this Node.js script:

```javascript
const textToSpeech = require('@google-cloud/text-to-speech');

async function testServiceAccount() {
  try {
    const client = new textToSpeech.TextToSpeechClient();
    const [result] = await client.listVoices();
    console.log('Service account working! Found', result.voices.length, 'voices');
  } catch (error) {
    console.error('Service account error:', error.message);
  }
}

testServiceAccount();
```

## Production Deployment

### Environment Variables

For production, set these environment variables:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
export GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### Security Best Practices

1. **Use IAM roles with minimal permissions**
2. **Store credentials securely** (e.g., secret management service)
3. **Rotate keys regularly** (every 90 days recommended)
4. **Monitor service account usage** in Cloud Console
5. **Enable audit logging** for security monitoring

### Cloud Run / App Engine Deployment

For Google Cloud services, you can use:

1. **Default service account** (not recommended for production)
2. **Attach custom service account** to your compute instance
3. **Use Workload Identity** for GKE deployments

## Key Management

### Rotating Keys

1. Go to **IAM & Admin** > **Service Accounts**
2. Click on your service account
3. Go to **KEYS** tab
4. Click **ADD KEY** > **Create new key**
5. Download the new key
6. Update your application configuration
7. Delete the old key after confirming the new one works

### Monitoring Usage

1. Go to **IAM & Admin** > **Service Accounts**
2. Click on your service account
3. View the **Activity** tab to see recent usage
4. Set up **Cloud Monitoring** alerts for unusual activity

## Troubleshooting

### Common Issues

1. **"Application Default Credentials not found"**:
   - Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to the correct file
   - Check file permissions (should be readable by your application)
   - Verify the file is valid JSON

2. **"Permission denied"**:
   - Verify the service account has the "Cloud Text-to-Speech Client" role
   - Check that the Text-to-Speech API is enabled
   - Ensure your project has billing enabled

3. **"Project not found"**:
   - Verify `GOOGLE_CLOUD_PROJECT_ID` is correct
   - Ensure the service account is in the correct project
   - Check project permissions

4. **"Invalid key file"**:
   - Re-download the key file from Cloud Console
   - Verify the file wasn't corrupted during download
   - Check file encoding (should be UTF-8)

### Verification Steps

1. **Check file existence**:
   ```bash
   ls -la /path/to/your/service-account-key.json
   ```

2. **Verify JSON format**:
   ```bash
   cat /path/to/your/service-account-key.json | jq .
   ```

3. **Test authentication**:
   ```bash
   gcloud auth activate-service-account --key-file=/path/to/your/service-account-key.json
   ```

## Security Considerations

### What NOT to do:

- ❌ Never commit service account keys to version control
- ❌ Don't share key files via email or chat
- ❌ Avoid using overly broad permissions
- ❌ Don't use service accounts for user authentication

### Best Practices:

- ✅ Use environment variables for credentials
- ✅ Implement least privilege access
- ✅ Regularly rotate keys
- ✅ Monitor and audit service account usage
- ✅ Use separate service accounts for different environments

## Alternative Authentication Methods

### For Development:
- **Application Default Credentials** with `gcloud auth application-default login`
- **User credentials** for testing (not recommended for production)

### For Production:
- **Workload Identity** (for GKE)
- **Instance service accounts** (for Compute Engine)
- **Secret Manager** integration

## Additional Resources

- [Google Cloud IAM Documentation](https://cloud.google.com/iam/docs/)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/understanding-service-accounts)
- [Text-to-Speech API Documentation](https://cloud.google.com/text-to-speech/docs/)
- [Authentication Overview](https://cloud.google.com/docs/authentication/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Review Google Cloud Console logs
4. Test with minimal permissions first
5. Consult Google Cloud documentation

---

**Note**: Service account keys provide powerful access to your Google Cloud resources. Handle them with the same care you would use for passwords or API keys. 