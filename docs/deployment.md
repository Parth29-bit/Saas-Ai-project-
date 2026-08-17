# Supportly AI - Production Deployment Guide

## Deploying Frontend (Vercel / Netlify)
1. Build the Vite bundle: `npm run build:frontend`.
2. Connect your Git repository to Vercel.
3. Configure Environment Variables:
   - `VITE_API_URL=https://api.yourdomain.com/api/v1`

## Deploying Backend (Render / Railway / Node Server)
1. Build TypeScript: `npm run build:backend`.
2. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_URL=https://yourdomain.com`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/supportly_ai`
   - `JWT_SECRET=<your-secure-jwt-secret>`
   - `AI_API_KEY=<your-gemini-api-key>`
3. Run Start Command: `node dist/server.js`.
