import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
  temperature: 0.2,
  model: "gpt-4o-mini",
});
