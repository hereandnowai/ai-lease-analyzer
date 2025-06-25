
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { LeaseData } from '../types';
import { GEMINI_API_MODEL, BRANDING_INFO } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key (process.env.API_KEY) is not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

const parseGeminiResponse = (responseText: string): any => {
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", e);
        console.error("Problematic JSON string:", jsonStr);
        const errorText = jsonStr.length > 300 ? jsonStr.substring(0, 300) + "..." : jsonStr;
        throw new Error(`Failed to parse AI response. Content: ${errorText}`);
    }
}


export const analyzeLeaseWithGemini = async (file: File, base64FileContent: string): Promise<LeaseData> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const model = GEMINI_API_MODEL;

  const filePart = {
    inlineData: {
      mimeType: file.type || 'application/octet-stream',
      data: base64FileContent,
    },
  };

  const textPart = {
    text: `You are an AI Lease Analyzer. Your task is to extract key information from the provided document content.
The document content is provided as a base64 encoded string with MIME type ${file.type}. The document may be in various languages (e.g., English, Hindi, Tamil, Spanish, French, German); attempt to process it. If you cannot process the language or the document type effectively, state that clearly in the 'analysisNotes' field.

Analyze the document and extract the following information in a structured JSON format.
Your response MUST be a single, valid JSON object and NOTHING ELSE. Do not include any text, comments, or notes before or after the JSON object.
Do not use markdown code fences (like \`\`\`json) in your response.
All string values within the JSON must be properly escaped (e.g., double quotes within strings should be escaped as \\").
Absolutely no conversational text, explanations, or extraneous characters should appear outside of the JSON structure, or *within* the string values unless they are part of the extracted data itself and are properly escaped.

HYPER-CRITICAL RULES FOR JSON ARRAYS (e.g., clausesDetected, flaggedIssues, policyDeviations):
1.  Arrays MUST be correctly formatted JSON arrays of strings. Example: \`["Clause A", "Clause B", "Clause C"]\`.
2.  Each string element MUST be enclosed in double quotes (\`"\`).
3.  Elements within the array MUST be separated by a comma (\`,\`).
4.  The LAST element in an array MUST NOT have a trailing comma. Example: \`["Item1", "Item2"]\` is CORRECT. \`["Item1", "Item2",]\` is INCORRECT.
5.  There should be NO missing commas between string elements. \`["Item1" "Item2"]\` is INCORRECT; it must be \`["Item1", "Item2"]\`.
6.  Arrays must ONLY contain the specific items requested (e.g., actual detected clauses, identified issues, or policy deviations).
7.  Do NOT include any general commentary, narrative, processing artifacts, or any other UNQUOTED or non-data text WITHIN the JSON arrays themselves. Every single item in these arrays MUST be a self-contained, valid JSON string representing an extracted piece of information.
8.  Ensure NO unquoted text or extraneous characters exist between array elements or within the array structure, apart from standard JSON syntax (commas, quotes, brackets).
9.  AVOID COMMON MISTAKES:
    *   Missing commas: \`["Clause A" "Clause B"]\` (WRONG) -> Should be: \`["Clause A", "Clause B"]\` (RIGHT)
    *   Unquoted elements: \`["Clause A", UnquotedText]\` (WRONG) -> Should be: \`["Clause A", "UnquotedText"]\` (RIGHT)
    *   Extraneous text/commentary in array: \`["Clause A", "Clause B" this is bad text]\` (WRONG). If "this is bad text" is not a clause, it MUST NOT be there.
    *   Trailing comma on last element: \`["Clause A", "Clause B",]\` (WRONG) -> Should be: \`["Clause A", "Clause B"]\` (RIGHT)
10. ABSOLUTELY NO UNQUOTED WORDS, PHRASES, OR RANDOM CHARACTERS like 'camphor', 'inhaled', 'creams', 'pulsed', or similar words should appear between valid, comma-separated, double-quoted string elements in an array, OR after the last quoted element before the closing bracket. If such a word is intended as data, it MUST be enclosed in double quotes (e.g., \`["Item A", "camphor details", "Item B"]\`). If it's an error/artifact, it MUST BE OMITTED.

JSON Schema to follow:
1.  startDate: Start Date of the lease (format as YYYY-MM-DD if possible, otherwise as found).
2.  endDate: End Date of the lease (format as YYYY-MM-DD if possible, otherwise as found).
3.  rentAmount: Monthly Rent Amount (include currency symbol and amount, e.g., "$1500/month" or "₹25,000/month").
4.  landlord: Landlord's Name.
5.  tenant: Tenant's Name.
6.  propertyAddress: Property Address.
7.  clausesDetected: A list of important clauses detected. MUST be a JSON array of strings, strictly following all rules above.
8.  flaggedIssues: A list of any flagged issues or missing standard clauses. MUST be a JSON array of strings, strictly following all rules above.
9.  riskScore: Assess a compliance risk score. Must be one of: "Low", "Moderate", "High", or "N/A" if not assessable.
10. riskJustification: Briefly explain the reason for the assigned risk score (1-2 sentences).
11. policyDeviations: List any terms that deviate from common lease practices. If none, return an empty array. MUST be a JSON array of strings, strictly following all rules above.
12. summary: Concise summary (max 200 words) of key dates, responsibilities, financial obligations, and critical legal clauses.
13. analysisNotes: Notes about the analysis process (e.g., parsing difficulty, language, or if not a lease). If not a lease, state clearly (e.g., 'The uploaded document does not appear to be a lease agreement. It seems to be [document type].'), and set other fields to 'N/A' or empty arrays.

If specific information cannot be found, provide "Not Found", "N/A", or an empty array/string as appropriate.
Return *only* a single JSON object matching this structure:
{
  "startDate": "string",
  "endDate": "string",
  "rentAmount": "string",
  "landlord": "string",
  "tenant": "string",
  "propertyAddress": "string",
  "clausesDetected": ["string"],
  "flaggedIssues": ["string"],
  "riskScore": "string", 
  "riskJustification": "string",
  "policyDeviations": ["string"],
  "summary": "string",
  "analysisNotes": "string"
}
Ensure the entire response is a perfectly valid JSON object. No extra text, comments, or formatting outside JSON.
`
  };
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: { parts: [filePart, textPart] },
        config: {
          responseMimeType: "application/json",
          // Default thinking (enabled) is better for document analysis quality.
        }
    });

    const parsedData = parseGeminiResponse(response.text);
    
    // Basic validation of the parsed data structure
    if (parsedData && typeof parsedData.startDate !== 'undefined' && typeof parsedData.riskScore !== 'undefined') {
         // Ensure arrays are actually arrays, even if empty, to prevent downstream errors
         parsedData.clausesDetected = Array.isArray(parsedData.clausesDetected) ? parsedData.clausesDetected : [];
         parsedData.flaggedIssues = Array.isArray(parsedData.flaggedIssues) ? parsedData.flaggedIssues : [];
         parsedData.policyDeviations = Array.isArray(parsedData.policyDeviations) ? parsedData.policyDeviations : [];
        
         return parsedData as LeaseData;
    } else {
        console.error("Parsed data is not in expected LeaseData format:", parsedData);
        throw new Error(`AI response was not in the expected JSON format. Check console for details.`);
    }

  } catch (error) {
    console.error("Error calling Gemini API for lease analysis:", error);
    if (error instanceof Error) {
        // Avoid exposing raw "Content: [long string]" in user-facing error for this specific function.
        if (error.message.startsWith("Failed to parse AI response.")) {
             throw new Error("The AI returned an unexpected response format. Please try a different document or check the console for details.");
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API for lease analysis.");
  }
};


export const askAboutLeaseWithGemini = async (leaseContext: string, userQuestion: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  if (!userQuestion.trim()) {
    return "Please ask a question.";
  }

  const model = GEMINI_API_MODEL;
  
  const prompt = `You are an AI Legal Assistant. You have been provided with key details and a summary of a lease agreement.
A user has a specific question about this lease. Answer the question based *only* on the provided lease information.
If the information to answer the question is not present in the provided lease details, clearly state that you cannot answer from the given context.
Do not make assumptions or provide information not explicitly found in the lease details. Keep your answer concise and to the point.

Provided Lease Details:
---
${leaseContext}
---

User's Question: ${userQuestion}

Your Answer:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            // For Q&A, lower latency might be good.
            // thinkingConfig: { thinkingBudget: 0 } 
        }
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API for lease question:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while asking AI about the lease.");
  }
};

export const createGeneralChatSession = (): Chat => {
  if (!API_KEY) {
    // This case should ideally be handled by UI preventing chat initialization
    // but as a safeguard for the service function:
    throw new Error("Gemini API key is not configured. Cannot create chat session.");
  }
  const model = GEMINI_API_MODEL;
  return ai.chats.create({
    model: model,
    config: {
      systemInstruction: `You are a helpful and friendly AI assistant for ${BRANDING_INFO.organizationShortName}. 
      Your purpose is to answer user questions on a wide range of topics. 
      Be concise and clear in your responses. 
      You can understand and respond in multiple languages. 
      Maintain a professional and courteous tone. 
      If a user asks about their lease, and you don't have specific lease details, politely guide them to upload their lease using the 'Analyze Your Lease Now' feature for specific analysis. Do not ask them to paste lease text here.
      Your responses should be formatted as plain text. Do not use markdown.`,
       // For a general chatbot, default thinking (enabled) should be fine for quality.
       // If very low latency is desired above all else:
       // thinkingConfig: { thinkingBudget: 0 }
    }
  });
};