# InfixMart Chatbot

This is a simple chatbot application built with Express.js and Google Gemini AI.

## Features

- Interactive chat interface
- AI-powered responses using Google Gemini
- Responsive design for mobile and desktop
- Vercel deployment ready

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file and add your Google Gemini API key:
   ```
   API_KEY=your_api_key_here
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## Vercel Deployment

1. Make sure you have a `.env` file with your API key
2. Push your code to GitHub
3. Connect your GitHub repository to Vercel
4. In Vercel dashboard, go to Settings > Environment Variables
5. Add your `API_KEY` environment variable
6. Deploy!

## Important Notes

- Make sure to set the `API_KEY` environment variable in Vercel
- The app uses Google Gemini 2.0 Flash model
- CORS is enabled for cross-origin requests

## Technologies Used

- Express.js
- Google Gemini AI
- HTML/CSS/JavaScript
- Vercel (deployment)
