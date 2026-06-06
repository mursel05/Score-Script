import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface EvaluationResult {
  overallBand: number;
}

// Default system instruction — users replace this file with their own criteria
const DEFAULT_SYSTEM_INSTRUCTION = `You are a professional essay evaluator. 
Evaluate the essay strictly based on the following criteria:

1. Task Achievement / Task Response (25%): How well the essay addresses the prompt
2. Coherence and Cohesion (25%): Logical structure, paragraphing, linking
3. Lexical Resource (25%): Range and accuracy of vocabulary
4. Grammatical Range and Accuracy (25%): Range and accuracy of grammar

Score using the IELTS band scale (0–9, in 0.5 increments).

IMPORTANT: Return ONLY valid JSON with no markdown, no code blocks, no explanations.
The response must be exactly this structure:
{"overallBand": <number>}`;

function sanitizeInput(text: string): string {
  // Remove potential prompt injection patterns
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /system\s*:\s*/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|im_start\|>/gi,
    /<\|im_end\|>/gi,
    /###\s*(instruction|system|prompt)/gi,
    /you\s+are\s+now\s+/gi,
    /act\s+as\s+/gi,
    /pretend\s+to\s+be\s+/gi,
  ];

  let sanitized = text;
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, "[REMOVED]");
  }

  return sanitized.trim();
}

export async function evaluateEssay(
  content: string,
  systemInstruction?: string
): Promise<EvaluationResult> {
  const sanitizedContent = sanitizeInput(content);
  const instruction = systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 256,
      responseMimeType: "application/json",
    },
  });

  const prompt = `Please evaluate the following essay and return the result as JSON only:

---ESSAY START---
${sanitizedContent}
---ESSAY END---

Return only: {"overallBand": <number between 0-9 in 0.5 increments>}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();

  // Strip any markdown code fences just in case
  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: EvaluationResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${cleaned}`);
  }

  // Validate the result
  if (
    typeof parsed.overallBand !== "number" ||
    parsed.overallBand < 0 ||
    parsed.overallBand > 9
  ) {
    throw new Error(
      `Invalid overallBand value: ${parsed.overallBand}`
    );
  }

  // Round to nearest 0.5
  parsed.overallBand = Math.round(parsed.overallBand * 2) / 2;

  return parsed;
}
