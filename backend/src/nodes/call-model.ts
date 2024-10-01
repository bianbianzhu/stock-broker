import { BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { graphAnnotation } from "../graph-state.js";
import ALL_TOOLS_LIST from "../tools/index.js";
import { chatModel } from "../utils/models.js";

const systemFString = `You're an expert financial analyst, tasked with answering the users questions about a given company or companies.
You do not have up to date information on the companies, so you must call tools when answering users questions.
All financial data tools require a company ticker to be passed in as a parameter.
If you do not know the ticker, you should use the web search tool to find it.`;

const chatPromptTemplate = ChatPromptTemplate.fromMessages<{
  messages: BaseMessage[];
}>([
  ["system", systemFString],
  ["placeholder", "{messages}"],
]);

async function callModel(
  state: typeof graphAnnotation.State
): Promise<Partial<typeof graphAnnotation.State>> {
  const { messages } = state;

  const modelWithTools = chatModel.bindTools(ALL_TOOLS_LIST);

  const chain = chatPromptTemplate.pipe(modelWithTools);

  const response = await chain.invoke({ messages });

  return { messages: [response] };
}

export default callModel;
