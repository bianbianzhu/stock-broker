import { ToolNode } from "@langchain/langgraph/prebuilt";
import ALL_TOOLS_LIST from "../tools/index.js";

const toolNode = new ToolNode(ALL_TOOLS_LIST);

export default toolNode;
