import { AIMessage, isAIMessage, ToolMessage } from "@langchain/core/messages";
import { graphAnnotation } from "../graph-state.js";
import { purchaseStockToolSchema } from "../tools/purchase-stock.js";
import { getCompanyTicker } from "../utils/llm-based-utils.js";
import priceIntradayTool from "../tools/price-intraday.js";
import { z } from "zod";
import { IntervalSchema, TimeSeriesIntradaySchema } from "../utils/schema.js";

/**
 * This node gets triggered when there is a tool_call in the lastMessage with the name "purchase_stock" but no `requestedStockPurchaseDetails` present in the state.
 * @param state
 * @returns
 */
async function preparePurchaseDetails(
  state: typeof graphAnnotation.State
): Promise<Partial<typeof graphAnnotation.State>> {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  // TODO: Extract the following logic into a utility function
  if (
    lastMessage === undefined ||
    !isAIMessage(lastMessage) ||
    !Array.isArray(lastMessage.tool_calls) ||
    lastMessage.tool_calls.length === 0
  ) {
    throw new Error("No tool calls present in the last message");
  }

  const purchaseStockToolCall = lastMessage.tool_calls.find(
    (toolCall) => toolCall.name === "purchase_stock"
  );

  if (!purchaseStockToolCall) {
    throw new Error("No purchase_stock tool call found in the last AI message");
  }

  const validationResult = purchaseStockToolSchema.safeParse(
    purchaseStockToolCall.args
  );

  if (!validationResult.success) {
    throw new Error(
      `Invalid purchase_stock tool call arguments: ${validationResult.error.errors[0].message}`
    );
  }

  let { ticker, companyName, maxPrice, quantity } = validationResult.data;

  // if the user did not provide a ticker
  // see if the user provided a company name
  // if so, we need to fetch the ticker
  // if not, we need to ask the user to provide a ticker or company name
  if (!ticker) {
    if (!companyName) {
      const toolMessage = new ToolMessage({
        content: "This is a placeholder message",
        tool_call_id: purchaseStockToolCall.id ?? "UNKNOWN",
      });

      const assistantMessage = new AIMessage({
        content: "Please provide a ticker or company name",
      });

      return {
        messages: [toolMessage, assistantMessage],
      };
    } else {
      ticker = await getCompanyTicker(companyName);
    }
  }

  if (!maxPrice) {
    const interval: z.infer<typeof IntervalSchema> = "1min";
    // if the user did not provide a max price, default to the current price
    const intradayPrice = await priceIntradayTool.invoke({
      symbol: ticker,
      interval,
    }); // accepts either a tool call or the args directly

    const latestPrice =
      intradayPrice[`Time Series (${interval})`][
        intradayPrice["Meta Data"]["3. Last Refreshed"]
      ]["4. close"];

    console.log(latestPrice);
  }

  return {};
}

export default preparePurchaseDetails;
