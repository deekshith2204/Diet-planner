# NutriAI Deployment

Deploy the backend to Render and the frontend to Vercel.

## 1. Commit and Push

```powershell
git status
git add .
git commit -m "chore: prepare deployment"
git push
```

## 2. Backend on Render

Create a new **Web Service** from the GitHub repo.

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Environment variables:

```env
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

Render provides the public backend URL after deploy, for example:

```text
https://nutriai-api.onrender.com
```

## 3. MongoDB Atlas

In Atlas **Network Access**, allow Render to connect. For a student demo, use:

```text
0.0.0.0/0
```

For production, restrict this to trusted outbound IPs.

## 4. Frontend on Vercel

Create a new Vercel project from the same GitHub repo.

- Root directory: `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Environment variable:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

After Vercel deploys, copy the Vercel URL back into Render as `CLIENT_URL`, then redeploy the Render service.

## 5. Final Test

Test these production URLs:

```text
https://your-render-backend.onrender.com/health
https://your-vercel-app.vercel.app
```

Then run through register, verify email, create health profile, generate meal plan, log food, and ask the assistant.
