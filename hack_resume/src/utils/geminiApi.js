import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Resume suggestions with job context
export const getResumeSuggestions = async (resumeData, jobTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptText = `
      I have a resume and the user is applying for the job: "${jobTitle}".
      Please provide tailored suggestions to improve this resume for that job.

      Here is the resume data:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    console.log("🔑 API Key:", process.env.REACT_APP_GEMINI_API_KEY);
    console.log("📤 Prompt sent to Gemini API:", promptText);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    });

    const response = await result.response;
    const generatedText = response.text();

    return generatedText || "No response from AI";
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return "Sorry, something went wrong while getting suggestions.";
  }
};
