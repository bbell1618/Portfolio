import OpenAI from "openai";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODELS = {
  ANALYSIS: "anthropic/claude-sonnet-4-20250514",
  LIGHT: "openai/gpt-4o-mini",
  FALLBACK: "meta-llama/llama-3.1-70b-instruct",
};
