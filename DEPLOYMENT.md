# Deployment Guide for EducaWorld App

This guide provides multiple options to deploy your React + Vite application.

## Prerequisites

1. **Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Git Repository**: Your code should be pushed to GitHub, GitLab, or Bitbucket

## Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. **Sign up/Login** to [Netlify](https://netlify.com)
2. **Connect your repository**:
   - Click "New site from Git"
   - Choose your Git provider and repository
3. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are already configured in `netlify.toml`)
4. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your actual API key
5. **Deploy**: Netlify will automatically build and deploy your app

### Option 2: Vercel (Fast & Optimized)

1. **Sign up/Login** to [Vercel](https://vercel.com)
2. **Import your repository**:
   - Click "New Project"
   - Import from your Git provider
3. **Configure environment variables**:
   - During setup or in Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your actual API key
4. **Deploy**: Vercel will automatically detect it's a Vite app and deploy

### Option 3: GitHub Pages (Free for public repos)

1. **Install gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

   **Note**: GitHub Pages doesn't support environment variables for security. You'll need to hardcode the API key or use a different approach.

### Option 4: Railway (Good for full-stack apps)

1. **Sign up** at [Railway](https://railway.app)
2. **Connect repository** and select your repo
3. **Set environment variables**:
   - Add `GEMINI_API_KEY` in the Variables tab
4. **Deploy**: Railway will auto-detect and deploy

## Important Security Notes

⚠️ **API Key Security**: Since this is a frontend app, your Gemini API key will be visible in the browser. Consider:
- Using API key restrictions in Google Cloud Console
- Implementing a backend proxy to hide the API key
- Setting up domain restrictions for the API key

## Testing Your Deployment

1. Visit your deployed URL
2. Check that the app loads correctly
3. Test API functionality to ensure the Gemini API key is working
4. Check browser console for any errors

## Troubleshooting

- **Build fails**: Check that all dependencies are installed and there are no TypeScript errors
- **API not working**: Verify the environment variable name matches what's in your `vite.config.ts`
- **404 on refresh**: Make sure your platform supports SPA redirects (configured in `netlify.toml`)

## Local Testing

Before deploying, test locally:
```bash
npm run build
npm run preview
```

This will serve your built application locally to ensure everything works correctly.