import { END, START, StateGraph } from "@langchain/langgraph";
import { toolsCondition } from "@langchain/langgraph/prebuilt";
import { graphAnnotation } from "graph-state.js";
import callModel from "nodes/callModel.js";
import toolNode from "nodes/toolNode.js";

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

export const graph = workflow.compile();
