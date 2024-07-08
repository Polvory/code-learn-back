import AsyncOpenAI from "openai";
import { getOpenAiConfig } from "../config/open-ai.config";

export const openai = new AsyncOpenAI({
    apiKey: getOpenAiConfig().token,
});
