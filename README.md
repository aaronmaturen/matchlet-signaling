# Wingspan Signaling Server

WebRTC signaling server for Wingspan multiplayer memory matching game.

## Features

- WebSocket-based signaling using Socket.IO
- Room management for multiplayer games
- WebRTC peer connection facilitation
- Deployable to Fly.io

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

## Production

```bash
# Start production server
npm start
```

## Deployment to Render

1. Create a free account on [Render.com](https://render.com)

2. Connect your GitHub repository to Render

3. Create a new Web Service and select your repository

4. Configure the following settings:
   - Name: wingspan-signaling
   - Runtime: Node
   - Build Command: `npm ci --only=production`
   - Start Command: `node server.js`
   - Environment Variables:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `CORS_ORIGIN`: https://your-wingspan-frontend-url.com

5. Click "Create Web Service"

Alternatively, you can use the `render.yaml` blueprint in this repository for automatic deployment.
# matchlet-signaling
