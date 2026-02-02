# Google Cloud Text-to-Speech Setup Guide

This guide will help you set up Google Cloud Text-to-Speech API credentials for the voice agent.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "wildcard-trivia")
5. Click "Create"

## Step 2: Enable the Text-to-Speech API

1. In your Google Cloud project, go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Text-to-Speech API"
3. Click on it and click "Enable"

## Step 3: Create a Service Account

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter a name (e.g., "tts-service")
4. Click "Create and Continue"
5. For the role, select "Cloud Text-to-Speech API User" or "Cloud Text-to-Speech API Admin"
6. Click "Continue" then "Done"

## Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. A JSON file will be downloaded to your computer

## Step 5: Set Up Credentials

### Option A: Service Account JSON as Environment Variable (Recommended for Deployment)

**Best for: Railway, Heroku, Render, and other deployment platforms**

1. Open the downloaded JSON file
2. Copy the **entire JSON content** (all of it, including curly braces)
3. In your deployment platform, add it as a **secret/environment variable**:
   - **Variable name**: `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value**: Paste the entire JSON content

**Example for Railway:**
- Go to your project → Variables
- Add new variable: `GOOGLE_SERVICE_ACCOUNT_JSON`
- Paste the JSON content (Railway handles it securely)

**Example for Heroku:**
```bash
heroku config:set GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' --app your-app-name
```

**⚠️ Security Notes:**
- Use your platform's **secret management** feature (not regular env vars)
- Never commit this to git
- The JSON should be on a single line or properly escaped

### Option B: Service Account JSON File (For Local Development)

1. Save the downloaded JSON file somewhere safe (e.g., `backend/google-credentials.json`)
2. Set the environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/google-credentials.json"
   ```
   
   Or add it to your `backend/.env` file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/google-credentials.json
   ```

**⚠️ Security**: 
- Add `google-credentials.json` to `.gitignore` to prevent committing it!
- Use file permissions: `chmod 600 google-credentials.json`

### Option C: Application Default Credentials (For Local Dev Only)

**Note: This doesn't work on deployed apps, only local development**

1. Install Google Cloud SDK:
   ```bash
   brew install google-cloud-sdk  # macOS
   ```

2. Authenticate:
   ```bash
   gcloud auth application-default login
   ```

This stores credentials securely in your home directory - no JSON files needed for local dev.

## Step 6: Verify Setup

Test that the credentials work:

```bash
cd backend
python -c "from apis.tts_service import get_tts_client; client = get_tts_client(); print('Success!')"
```

## Pricing

Google Cloud Text-to-Speech has a free tier:
- **Free tier**: 0 to 4 million characters per month
- **Paid tier**: $4.00 per 1 million characters after free tier

For most trivia games, you'll likely stay within the free tier.

## Security Best Practices

### 🔒 Recommended Security Practices:

1. **For Local Development**: Use `gcloud auth application-default login` (Option A)
   - Most secure
   - No files to manage
   - Automatic token refresh

2. **For Production on GCP**: Deploy on Google Cloud Platform
   - Uses metadata service automatically
   - No credentials needed
   - Most secure for production

3. **For Production on Other Platforms**: Use secret management
   - Railway: Use Railway's secret variables
   - Heroku: Use Heroku config vars
   - Never use regular environment variables for sensitive data

4. **If Using JSON Files**:
   - ⚠️ Never commit to git
   - ⚠️ Add to `.gitignore`
   - ⚠️ Use file permissions: `chmod 600 google-credentials.json`
   - ⚠️ Rotate keys every 90 days
   - ⚠️ Delete old keys after rotation

5. **Service Account Permissions**:
   - Use principle of least privilege
   - Only grant "Cloud Text-to-Speech API User" role
   - Don't use admin roles unless necessary

## Alternative: Use Browser TTS (No Setup Required)

If you don't want to set up Google Cloud TTS, the voice agent will automatically fall back to the browser's built-in Text-to-Speech API, which requires no credentials or setup.
