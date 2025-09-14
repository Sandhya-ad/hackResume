import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getResumeSuggestions = async (resumeData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptText = `
      Can you provide me with any suggestions for this resume?
      Here are the details:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    console.log("API Key:", process.env.REACT_APP_GEMINI_API_KEY);
    console.log("Prompt sent to Gemini API:", promptText);

    // ✅ Proper request format
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    });

    // ✅ Extract response
    const response = await result.response;
    const generatedText = response.text();

    return generatedText || "No response from AI";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, something went wrong while getting suggestions.";
  }
};
