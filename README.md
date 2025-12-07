
# StyleAI Studio

StyleAI Studio is a cutting-edge web application that leverages generative AI to revolutionize how users visualize and manage fashion. It offers a suite of tools for both personal style exploration and professional business catalog creation, providing a seamless and intuitive experience powered by Google's Gemini models.

<img width="1911" height="1117" alt="style" src="https://github.com/user-attachments/assets/fbd2d695-4f7a-444f-a514-62d794354e29" />


---

## 🎬 Project Showcase

- **[View the Project Proposal](https://github.com/mikesplore/style-ai-studio/blob/main/public/uploads/proposal.md)**
- **[View the Project Presentation](https://1drv.ms/p/c/c54129bf85dd293c/EVvCvk-yyn5FjJ3mpP6wXFUBGL5iQ_wB8T4sif37iS6hvA?e=FKJCXO)**: An in-depth look at the project's vision, architecture, and features.
- **[View the Demo Video](https://github.com/mikesplore/style-ai-studio/blob/main/public/uploads/demo%20video/InShot_20251128_182447273.mp4)**.


---

## ✨ Core Features

### For Personal Users
- **Virtual Try-On:** See yourself in new outfits instantly. Upload a photo of yourself and combine it with images of clothing items to generate a realistic preview of you wearing the selected outfit.
- **Digital Wardrobe:** Upload and manage your personal clothing items and photos. All your assets are securely stored in your personal Google Drive folder, making them easy to access and reuse.
- **Outfit History:** Automatically saves every generated try-on image to your Google Drive, creating a visual history of your style experiments.

### For Business Users
- **AI Catalog Generator:** Create professional-grade product photos for your business. Combine images of your mannequins with your product photos and a style description to generate high-quality, AI-powered catalog images.
- **Business Asset Management:** A dedicated space to upload, manage, and organize your brand's assets, such as mannequin photos and product images, stored securely in your Google Drive.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Google Gemini](https://deepmind.google.com/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with Google Provider
- **Database:** [Firestore](https://firebase.google.com/docs/firestore) for user data (e.g., generation limits)
- **File Storage:** [Google Drive](https://www.google.com/drive/) for all user-uploaded images and AI-generated outputs.

---

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/mikesplore/studio.git
cd studio
npm install
```

### 3. Environment Setup

Create a `.env` file in the root of your project by copying the example below. You will need to obtain credentials from Google Cloud and Firebase to populate this file.

```env
# Gemini API Key (Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key-here

# NextAuth.js Configuration
AUTH_SECRET=generate-a-strong-secret-here
NEXTAUTH_URL=http://localhost:9002

# Google OAuth Credentials (Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Firebase Configuration (Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Running the Development Server

Once your `.env` file is configured, you can start the application:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

---

## 🌍 Deploying to Production

When you deploy your application to a live URL (e.g., via Firebase App Hosting), you **must** update your Google Cloud and environment variables for authentication to work.

### Step 1: Update your `.env` file

Your `NEXTAUTH_URL` variable must be changed from `http://localhost:9002` to your public application URL.

```env
# Example for a deployed app on Firebase App Hosting
NEXTAUTH_URL=https://your-app-name.web.app
```

### Step 2: Update Google Cloud OAuth Credentials

Google needs to know your new production URL to allow users to sign in.

1.  Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2.  Click on the name of the **OAuth 2.0 Client ID** you created during the initial setup.
3.  Under **Authorized JavaScript origins**, click **+ ADD URI** and add your production URL (e.g., `https://your-app-name.web.app`).
4.  Under **Authorized redirect URIs**, click **+ ADD URI** and add your production callback URL. This must match your `NEXTAUTH_URL` + `/api/auth/callback/google`. For example: `https://your-app-name.web.app/api/auth/callback/google`.
5.  Click **Save**.

Your local `http://localhost:9002` URIs can remain for local testing. After completing these steps, Google Sign-In will work on your live application.

---

## 🔑 Environment Variables Explained

You need to configure the following services to run the application:

#### **Google AI (for Gemini API)**
- `GEMINI_API_KEY`:
  - **Purpose:** Grants access to Google's Gemini models for all generative AI features.
  - **How to get it:**
    1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    2. Click "**Create API key**" and copy the key.

#### **NextAuth.js (for Authentication)**
- `AUTH_SECRET`:
  - **Purpose:** A secret key used to encrypt session data and tokens.
  - **How to get it:** Generate a strong, random string. You can use an online generator or the following command in your terminal: `openssl rand -hex 32`
- `NEXTAUTH_URL`:
  - **Purpose:** The base URL of your application, used by NextAuth for redirects.
  - **Value for local development:** `http://localhost:9002`
  - **Value for production:** Your live application URL (e.g., `https://your-app.web.app`).

#### **Google Cloud Console (for OAuth & Google Drive)**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`:
  - **Purpose:** Allows users to sign in with their Google account and grants the app permission to access their Google Drive.
  - **How to get them:**
    1. Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
    2. Click "**Create Credentials**" > "**OAuth client ID**".
    3. Select "**Web application**" for the Application type.
    4. Under "**Authorized JavaScript origins**", add `http://localhost:9002` (for local) and your production URL (for live).
    5. Under "**Authorized redirect URIs**", add `http://localhost:9002/api/auth/callback/google` (for local) and your production callback URL.
    6. Click **Create** and copy the Client ID and Client Secret.

#### **Firebase (for User Database)**
- `NEXT_PUBLIC_FIREBASE_*` variables:
  - **Purpose:** Connects the application to your Firebase project to use Firestore for storing user-specific data.
  - **How to get them:**
    1. Go to the [Firebase Console](https://console.firebase.google.com/).
    2. Create a new project or select an existing one.
    3. Go to **Project Settings** (click the gear icon).
    4. In the **General** tab, scroll down to "**Your apps**".
    5. Click "**Add app**" and select the **Web** platform (`</>`).
    6. Register your app (e.g., "StyleAI Studio Web").
    7. After registration, Firebase will provide you with a `firebaseConfig` object. Copy the values from this object into your `.env` file.
    8. Go to the **Firestore Database** section in the Firebase console and create a new database in **Test mode** to get started quickly.
