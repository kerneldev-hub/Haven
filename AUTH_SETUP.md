# HAVEN OS Unified Identity Setup with Logto

HAVEN OS uses **Logto** as its centralized identity provider. Under the hood, Logto standardizes OAuth flows for Google, GitHub, GitLab, and Microsoft Azure AD into a single integration.

This document walks you through configuring Logto (Cloud Free Tier or self-hosted) for your HAVEN instance.

---

## 1. Logto Application Setup

1. **Sign Up / Log In**:
   - Go to [Logto Cloud](https://cloud.logto.io/) and create a free account (includes 100,000 monthly active users, completely free).
   - Alternatively, self-host Logto using their official Docker image.

2. **Create a Traditional Web Application**:
   - Go to **Applications** > **Create Application**.
   - Select **Traditional Web** (Express / Node.js).
   - Set the Application Name to `HAVEN OS Web App`.

3. **Configure Redirect URIs**:
   - **Redirect URI**:
     - Local Dev: `http://localhost:3000/api/auth/callback`
     - Production: `https://your-production-url.run.app/api/auth/callback`
   - **Post Sign-out Redirect URI**:
     - Local Dev: `http://localhost:3000/`
     - Production: `https://your-production-url.run.app/`

4. **Retrieve Credentials**:
   - Note your **App ID**, **App Secret**, and the Logto **Endpoint** (e.g., `https://xxxxxx.logto.app/`).
   - Copy these into your `.env` file (see `ENV_SETUP.md`).

---

## 2. Configure Social Identity Providers

In the Logto Console, navigate to **Connectors** > **Social Connectors** and enable the following:

### A. Google Auth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen** (User Type: External).
4. Go to **Credentials** > **Create Credentials** > **OAuth Client ID** (Web Application).
5. Add Authorized Redirect URIs provided in the Logto Google connector settings.
6. Copy the **Client ID** and **Client Secret** into Logto.

### B. GitHub Auth
1. Go to your [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set Application Name to `HAVEN OS`.
4. Copy the Authorization callback URL from the Logto GitHub connector page.
5. Register the application, and copy the **Client ID** and generate a new **Client Secret** to enter into Logto.

### C. GitLab Auth
1. Go to your GitLab Instance > **Preferences** > **Applications**.
2. Create a new application named `HAVEN OS`.
3. Select the `read_user`, `openid`, `profile`, and `email` scopes.
4. Set the Redirect URI to the one provided by Logto.
5. Save and copy the **Application ID** and **Secret** to Logto.

### D. Microsoft Auth
1. Go to the [Azure Portal](https://portal.azure.com/) > **Microsoft Entra ID** > **App registrations**.
2. Click **New registration**.
3. Choose **Supported account types** (e.g. Any organizational directory + personal Microsoft accounts).
4. Enter the redirect URI supplied in Logto's Microsoft connector page.
5. Create a client secret under **Certificates & secrets**, then copy the **Application (client) ID** and **Secret value** into Logto.

---

## 3. Local Verification

Verify your authentication flow by checking the login route in your browser:
```bash
# Start your development server
npm run dev
```
Navigate to `http://localhost:3000` and click **Sign In**. You should see the Logto login interface displaying the customized Google, GitHub, GitLab, and Microsoft authentication buttons.
