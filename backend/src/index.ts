import { END, START, StateGraph } from "@langchain/langgraph";
import { graphAnnotation } from "graph-state.js";

const stateGraph = new StateGraph(graphAnnotation);

const workflow = stateGraph
  .addNode("Test", (_state) => {
    return {};
  })
  .addEdge(START, "Test")
  .addEdge("Test", END);

export const graph = workflow.compile({
  interruptBefore: ["Test"],
});
