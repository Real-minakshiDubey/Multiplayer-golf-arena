import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const analyzeCodeWithSensei = async ({ challenge, userCode, error, language }) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        explanation: "The Arena Sensei is currently meditating (API Key missing). Please add GEMINI_API_KEY to the server .env to wake him up!",
        golfedTip: "Mock Tip: Use array.reduce() to save bytes on summation!"
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are the "Arena Sensei", a legendary Code Golf master. 
      Your goal is to help a player understand their mistake and teach them a "golfed" (minimalist) way to solve the problem.

      CONTEXT:
      Challenge: ${challenge.title}
      Description: ${challenge.description}
      Language: ${language}
      
      USER'S CODE:
      \`\`\`${language}
      ${userCode}
      \`\`\`

      ERROR/ISSUE:
      ${error || "The code passed but could be more efficient/shorter."}

      YOUR TASK:
      1. Briefly explain the mistake or inefficiency.
      2. Provide a "Golfed Tip" - a very short, advanced trick to save bytes.
      3. Provide a legendary minimalist version of the code (The "Sensei's Scroll").

      Respond in JSON format:
      {
        "explanation": "string",
        "golfedTip": "string",
        "senseiCode": "string"
      }
    `;

    // Retry logic for rate limits and network failures
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break; // success
      } catch (fetchErr) {
        const isRateLimit = fetchErr.status === 429;
        const isNetworkError = fetchErr instanceof TypeError || fetchErr.message?.includes('fetch failed');
        const isRetryable = isRateLimit || isNetworkError;

        if (isRetryable && attempt < 2) {
          const delay = (attempt + 1) * 5000; // 5s, 10s backoff
          const reason = isRateLimit ? 'rate limit' : 'network error';
          console.log(`Sensei hit ${reason}, retrying in ${delay / 1000}s... (attempt ${attempt + 1}/3)`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw fetchErr;
      }
    }

    const response = await result.response;
    const text = response.text();
    console.log("Sensei Raw Response:", text.substring(0, 200));
    
    // Improved JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      explanation: text,
      golfedTip: "The Sensei spoke in prose instead of JSON.",
      senseiCode: userCode
    };
  } catch (err) {
    console.error("Sensei AI Error:", err.message || err);
    const isRateLimit = err.status === 429;
    const isNetworkError = err instanceof TypeError || err.message?.includes('fetch failed');
    return {
      explanation: isRateLimit 
        ? "The Sensei is overwhelmed with students right now (rate limit). Wait a moment and try again."
        : isNetworkError
        ? "The Sensei lost connection to the cloud. Please try again in a few seconds."
        : "The Sensei encountered an error. Check server logs for details.",
      golfedTip: isRateLimit ? "Patience is the first lesson." : "A master knows when to rest.",
      senseiCode: userCode
    };
  }
};
