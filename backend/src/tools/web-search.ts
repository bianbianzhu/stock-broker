import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const webSearchTool = new TavilySearchResults({ maxResults: 2 });

export default webSearchTool;
