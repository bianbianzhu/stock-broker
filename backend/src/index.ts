import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { toolsCondition } from "@langchain/langgraph/prebuilt";
import { graphAnnotation } from "./graph-state.js"; // if using `graph-state.ts`, replace with `./graph-state.ts`, the studio failed to get the correct state.
import callModel from "./nodes/callModel.js";
import toolNode from "./nodes/toolNode.js";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { logSnapshot } from "./utils/logging.js";

enum GraphNode {
  callModel = "call_model",
  tools = "tools",
}

const stateGraph = new StateGraph(graphAnnotation);

const workflow = stateGraph
  .addNode(GraphNode.callModel, callModel)
  .addNode(GraphNode.tools, toolNode)
  .addEdge(START, GraphNode.callModel)
  .addConditionalEdges(GraphNode.callModel, toolsCondition, [
    GraphNode.tools,
    END,
  ])
  .addEdge(GraphNode.tools, GraphNode.callModel);

const checkpointer = new MemorySaver();

export const graph = workflow.compile({
  checkpointer,
});

const config: RunnableConfig = {
  configurable: {
    thread_id: "20241001",
  },
};

const response = await graph.invoke(
  {
    messages: [new HumanMessage("Hi, get the company facts of Tesla")],
  },
  config
);

const history = graph.getStateHistory(config);

for await (const snapshot of history) {
  logSnapshot(snapshot);
}
