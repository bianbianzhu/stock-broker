import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const webSearchTool = new TavilySearchResults({ maxResults: 1 });

export default webSearchTool;
