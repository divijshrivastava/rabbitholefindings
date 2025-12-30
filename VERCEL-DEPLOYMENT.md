# Vercel Deployment Guide

## Issues Fixed

### 1. Missing Vercel Configuration
- **Problem**: No `vercel.json` file to tell Vercel how to build and deploy
- **Solution**: Created `vercel.json` with proper build configuration

### 2. Build Command
- **Problem**: Vercel needs explicit build command
- **Solution**: Added `vercel-build` script and configured in `vercel.json`

### 3. Output Directory
- **Problem**: Vercel needs to know where build output is
- **Solution**: Configured `outputDirectory: "dist"` in `vercel.json`

### 4. Framework Detection
- **Problem**: Vercel might not auto-detect Vite
- **Solution**: Explicitly set `"framework": "vite"` in `vercel.json`

### 5. Node Version
- **Problem**: Unspecified Node version might cause compatibility issues
- **Solution**: Added `engines` field to `package.json` specifying Node 18+

## Configuration Files Created

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### .vercelignore
- Excludes unnecessary files from deployment
- Similar to `.gitignore` but for Vercel

## Deployment Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push
   ```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Ensure "Framework Preset" is set to "Vite" (or auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables (if needed):**
   - Add `VITE_API_URL` if you have a backend API
   - Vercel will automatically use these during build

## Common Issues & Solutions

### Issue: Build fails with module errors
**Solution**: Ensure all imports use relative paths or are properly resolved in `vite.config.js`

### Issue: 404 errors on routes
**Solution**: The `rewrites` in `vercel.json` handle SPA routing

### Issue: Assets not loading
**Solution**: Check that `base` path in `vite.config.js` is set correctly (`./` for relative paths)

### Issue: Environment variables not working
**Solution**: 
- Prefix with `VITE_` (e.g., `VITE_API_URL`)
- Add in Vercel dashboard under Project Settings > Environment Variables

## Testing Locally

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

This will build and serve the production version locally, helping catch issues before deployment.

## Deployment Checklist

- [x] `vercel.json` created with proper configuration
- [x] `package.json` has `vercel-build` script
- [x] Node version specified in `engines`
- [x] `.vercelignore` created
- [x] `vite.config.js` configured for production
- [ ] Test build locally (`npm run build`)
- [ ] Push to GitHub
- [ ] Deploy on Vercel

## Post-Deployment

After successful deployment:
1. Check that all routes work (especially if using client-side routing)
2. Verify assets load correctly
3. Test search functionality
4. Test dark mode toggle
5. Check mobile responsiveness

