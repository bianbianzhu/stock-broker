import { isAIMessage } from "@langchain/core/messages";
import { graphAnnotation } from "../graph-state.js";
import { END } from "@langchain/langgraph";
import { GraphNode } from "../index.js";

function shouldContinue(
  state: typeof graphAnnotation.State
): GraphNode | GraphNode[] | typeof END {
  const { messages, requestedStockPurchaseDetails } = state;

  const lastMessage = messages.at(-1);

  // Case 1: No message OR Not AI message OR No tool_calls present in the last message -> go to END
  if (
    lastMessage === undefined ||
    !isAIMessage(lastMessage) ||
    !Array.isArray(lastMessage.tool_calls) ||
    lastMessage.tool_calls.length === 0
  ) {
    return END;
  }

  //Case 2: AI message with tool_call(s) and the details needed to purchase stock is present -> Must go to ExecutePurchase
  if (requestedStockPurchaseDetails) {
    // even if the tool_call(s) does not have purchase_stock, still proceed to purchase -> make sure to reset requestedStockPurchaseDetails after (return undefined?)
    return GraphNode.ExecutePurchase;
  }

  // lastMessage.tool_calls must be an non-empty array
  return lastMessage.tool_calls.map((toolCall) => {
    // Case 3: tool_call is `purchase_stock` (but no `requestedStockPurchaseDetails` state) -> go to PreparePurchaseDetails
    if (toolCall.name === "purchase_stock") {
      return GraphNode.PreparePurchaseDetails;
    } else {
      // Case 4: tool_call is not `purchase_stock` -> go to Tools
      return GraphNode.Tools;
    }
  });
  // The underlying mechanism:
  // if the returned value is an array, for example [GraphNode.Tools, GraphNode.ExecutePurchase, GraphNode.Tools, GraphNode.Tools, GraphNode.Tools], all GraphNode.Tools will be combined into a single node destination.
  // like  return ["b", "c", "b", "b", "b"]; ===  return ["b", "c"];
}

export default shouldContinue;
