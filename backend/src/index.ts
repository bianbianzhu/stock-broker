import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { toolsCondition } from "@langchain/langgraph/prebuilt";
import { graphAnnotation } from "./graph-state.js"; // if using `graph-state.ts`, replace with `./graph-state.ts`, the studio failed to get the correct state.
import callModel from "./nodes/call-model.js";
import toolNode from "./nodes/tool-node.js";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { logSnapshot } from "./utils/logging.js";

export enum GraphNode {
  CallModel = "call_model",
  Tools = "tools",
  ExecutePurchase = "execute_purchase",
  PreparePurchaseDetails = "prepare_purchase_details",
}

const stateGraph = new StateGraph(graphAnnotation);

const workflow = stateGraph
  .addNode(GraphNode.CallModel, callModel)
  .addNode(GraphNode.Tools, toolNode)
  .addEdge(START, GraphNode.CallModel)
  .addConditionalEdges(GraphNode.CallModel, toolsCondition, [
    GraphNode.Tools,
    END,
  ])
  .addEdge(GraphNode.Tools, GraphNode.CallModel);

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
