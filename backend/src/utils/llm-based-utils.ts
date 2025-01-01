import { z } from "zod";
import webSearchTool from "../tools/web-search.js";
import { chatModel } from "./models.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function getCompanyTicker(companyName: string) {
  const searchResult = await webSearchTool.invoke(
    `What is the ticker symbol for ${companyName}?`
  );

  const schema = z
    .object({
      ticker: z
        .string()
        .describe(
          "A unique series of letters or characters assigned to publicly traded stocks"
        ),
    })
    .describe(
      `Extract the ticker symbol of ${companyName} from the provided context`
    );

  const chatModelWithStructuredOutput = chatModel.withStructuredOutput(schema, {
    name: "extract_ticker",
    strict: true,
  });

  const chatPromptTemplate = ChatPromptTemplate.fromMessages<{
    context: string;
  }>([
    [
      "system",
      `Your goal is to extract the ticker symbol for the company: ${companyName} from the provided context.`,
    ],
    ["human", "Context: {context}"],
  ]);

  const chain = chatPromptTemplate.pipe(chatModelWithStructuredOutput);

  const response = await chain.invoke({ context: searchResult });

  return response.ticker;
}
