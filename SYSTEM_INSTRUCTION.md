# System Instruction

This file is a placeholder for your custom essay evaluation criteria.

The application uses a default IELTS-style rubric (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).

## To customize:

1. Edit `lib/gemini.ts`
2. Replace the `DEFAULT_SYSTEM_INSTRUCTION` constant with your own criteria
3. Ensure you still instruct the model to return JSON format: `{"overallBand": <number>}`

## Example custom instruction:

```
You are an academic writing evaluator. Score essays on:
1. Argument quality (40%)
2. Evidence use (30%)  
3. Writing clarity (30%)

Return ONLY: {"overallBand": <0-9 score in 0.5 increments>}
```
