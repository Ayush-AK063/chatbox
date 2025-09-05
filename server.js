import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { fileURLToPath } from 'url';  // To resolve __dirname in ES Modules
import { dirname, join } from 'path'; // To resolve __dirname and join paths

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

console.log("Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("API_KEY exists:", !!process.env.API_KEY);
console.log("API_KEY length:", process.env.API_KEY ? process.env.API_KEY.length : 0);

if (!process.env.API_KEY) {
  console.error("ERROR: API_KEY environment variable is not set!");
  throw new Error("API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Function to run the chat and get a response
async function runChat(userInput) {
  try {
    console.log("Starting runChat with input:", userInput);
    console.log("API_KEY exists:", !!process.env.API_KEY);
    
    // Define chat history and model configuration
    const history = [
      {
        role: "user",
        parts: [{text: "You are Ashish, a friendly assistant who works for InfixMart. InfixMart is a website and brand that sells Tech products which is trending in India. Your job is to capture user's name and email address. Don't answer the user's question until they have provided you their name and email address, at that point verify the email address is correct, thank the user and output their name and email address in this format: {{name: user's name}} {{email: user's email address}}\nOnce you have captured user's name and email address. Answer user's questions related to InfixMart.\nInfixMart's website URL is: https://infixmart.com website."}],
      },
      {
        role: "model",
        parts: [{ text: "Hello! Welcome to InfixMart. My name is Ashish. What's your name?" }],
      },
      {
        role: "user",
        parts: [{ text: 'Hii'}],
      },
      {
        role: "model",
        parts: [{ text: "Hi there! Thanks for reaching out to InfixMart. Before I can answer your question, I'll need to capture your name and email address. Can you please provide that information?" }],
      },
    ];

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT", // Adjust as per available constants
        threshold: "BLOCK_MEDIUM_AND_ABOVE", // Adjust based on settings
      },
      // Add more safety settings if needed
    ];

    // Get the model
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: generationConfig,
      safetySettings: safetySettings,
    });

    // Start a chat session with history
    const chat = model.startChat({
      history: history,
    });

    // Send the user input and get response
    const result = await chat.sendMessage(userInput);
    console.log("Full result object:", JSON.stringify(result, null, 2));

    // Extract the response text properly
    const response = result.response.text();
    console.log("Generated response:", response);
    
    if (!response) {
      throw new Error("Empty response from AI model");
    }
    
    return response;
  } catch (error) {
    console.error("Error in generating content:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch content from the model: ${error.message}`);
  }
}

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files like index.html and loader.gif
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get("/loader.gif", (req, res) => {
  res.sendFile(join(__dirname, 'loader.gif'));
});

// Chat endpoint to receive user input and return a response
app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log("Incoming /chat request:", userInput);

    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Get the response from Google Gemini AI
    const response = await runChat(userInput);
    console.log("Sending response to client:", response);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message,
      response: "Sorry, I'm having trouble responding right now. Please try again later."
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
