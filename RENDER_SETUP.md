# Render Deployment Guide

## Architecture
- **Frontend**: React + JavaScript (GitHub Pages)
- **Backend**: Python + FastAPI (Render)
- **Database**: PostgreSQL (Render)

## Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Verify email

## Step 2: Create PostgreSQL Database
1. In Render dashboard, click **New +**
2. Select **PostgreSQL**
3. Name: `gift-nifty-db`
4. Database: `gift_nifty`
5. User: `gift_nifty_user`
6. Region: Choose nearest
7. Select **Free** tier
8. Click **Create Database**
9. Wait for it to be ready (~2 minutes)

## Step 3: Get Database Connection String
1. Click on your database in Render
2. Go to **Connections** tab
3. Copy the **Internal Database URL** (starts with `postgresql://`)
4. Format: `postgresql://gift_nifty_user:password@host:5432/gift_nifty`

## Step 4: Push Code to GitHub
Your code is already at: https://github.com/jsoumyanarayanan/TradeAnalysis

## Step 5: Deploy Python Backend to Render
1. In Render dashboard, click **New +**
2. Select **Web Service**
3. Connect your GitHub repository
4. Root directory: `backend`
5. Name: `gift-nifty-api`
6. Region: Same as database
7. Environment: `Python 3.11`
8. Branch: `main`
9. Click **Advanced**
10. Add Environment Variable:
    - Key: `DATABASE_URL`
    - Value: (paste your PostgreSQL connection string from Step 3)
11. Click **Create Web Service**
12. Wait for deployment (~5 minutes)

## Step 6: Get Backend URL
1. Click on your web service in Render
2. Copy the URL (e.g., `https://gift-nifty-api.onrender.com`)

## Step 7: Update Frontend API URL
1. Open `frontend/src/services/api.js`
2. Change API base URL to your Render backend URL
3. Or use relative path `/api` and configure proxy

## Step 8: Deploy Frontend to GitHub Pages
1. Build frontend: `cd frontend && npm run build`
2. Deploy `dist` folder to GitHub Pages
3. Or push and enable GitHub Pages in repo settings

## Environment Variables for Render
```
DATABASE_URL=postgresql://gift_nifty_user:PASSWORD@HOST:5432/gift_nifty
PYTHON_VERSION=3.11
```

## Notes
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Database is always available
- Both backend and database on same platform
