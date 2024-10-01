import { tool } from "@langchain/core/tools";
import { getFinancialDataset } from "../utils/financial-api-service.js";
import { SnapshotResponseSchema } from "../utils/schema.js";
import { z } from "zod";

const schema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
});

const pricesSnapshotTool = tool(
  async (args) => {
    const { ticker } = args;

    const response = await getFinancialDataset({
      endpoint: "/prices/snapshot",
      queryParams: { ticker },
      schema: SnapshotResponseSchema,
    });

    return JSON.stringify(response);
  },
  {
    name: "fetch_prices_snapshot",
    description:
      "This tool is called to retrieve the current stock price and related market data for a given company. The snapshot includes the current price, ticker symbol, day's change in price and percentage, timestamp of the data, and a nanosecond-precision timestamp. This tool should ALWAYS be called before purchasing a stock to ensure the most up-to-date price is used.",
    schema,
  }
);

export default pricesSnapshotTool;
