# 🚀 SwipePad Farcaster MiniApp Setup

This guide details the steps to run and test the SwipePad Farcaster MiniApp locally.

## 📋 Prerequisites
- **Pop!_OS / Linux** system
- **thirdweb Client ID** (Get one at [dash.thirdweb.com](https://dash.thirdweb.com/))
- **ngrok** account for local tunneling

## 🛠️ Local Development

1. **Install Dependencies**
   ```bash
   npm install thirdweb @farcaster/frame-sdk --legacy-peer-deps

   
## ⚠️ Important Development Rules
- **DO NOT** delete or modify the directory structure of `apps/farcaster` without approval.
- **NEVER** commit the `.env.local` file to GitHub; it contains your Thirdweb Secret Key.
- **Persistence**: All AI-generated code should be reviewed against the `sodofi` reference logic before being merged.
