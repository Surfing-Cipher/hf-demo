# Deploying to Render

## Step 1: Push to GitHub
1. Open terminal in `d:/Github/ANN-thrus/hf-demo`
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - HF Demo App"
   ```
3. Create a new repository on GitHub (e.g., `hf-demo`)
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hf-demo.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up (use your GitHub account)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`hf-demo`)
4. Configure:
   - **Name**: `hf-demo` (or any name you like)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
5. Click **"Create Web Service"**

## Step 3: Wait for Deployment
- Render will install dependencies and start your server
- You'll get a URL like: `https://hf-demo-xyz.onrender.com`

## Step 4: Test Your Live App
1. Open the URL Render gave you
2. Enter your Hugging Face API token
3. Test both features!

## Important Notes
- **Free tier**: App may sleep after inactivity (takes ~30s to wake up)
- **For Thursday**: Wake it up before your presentation by visiting the URL
- The URL will work on any device with internet!

## Troubleshooting
If deployment fails:
- Check the Render logs for errors
- Make sure `package.json` has the right `start` script
- Verify all files are committed to GitHub
