import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // safer way to store keys

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to send resume data to Gemini
export const getResumeSuggestions = async (resumeData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the prompt with resume details
    const prompt = `
      Can you provide me with any suggestions for this resume?
      Here are the details:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    const result = await model.generateContent(prompt);

    // The generated text will be here
    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, something went wrong while getting suggestions.";
  }
};
