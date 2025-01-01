import { tool } from "@langchain/core/tools";
import { getAlphaVantageData } from "../utils/alpha-vantage-service.js";
import { TimeSeriesIntradaySchema } from "../utils/schema.js";
import { z } from "zod";

const schema = z.object({
  symbol: z
    .string()
    .describe("The name of the equity of your choice. For example: IBM"),
});

const priceSnapshotFromIntradayTool = tool(
  async (args) => {
    const { symbol } = args;

    const FUNCTION_NAME = "TIME_SERIES_INTRADAY";
    const INTERVAL = "1min";

    const response = await getAlphaVantageData({
      endpoint: "/query",
      queryParams: {
        symbol,
        interval: INTERVAL, // default is 1min
        function: FUNCTION_NAME,
      },
      schema: TimeSeriesIntradaySchema(INTERVAL),
    });

    if (!response.success) {
      return "Error: Unable to fetch intraday stock price.";
    }

    response.data;

    //@ts-expect-error
    const lastRefreshed = response.data["Meta Data"]["3. Last Refreshed"];

    const latestPrice =
      //@ts-expect-error
      response.data[`Time Series (${INTERVAL})`][lastRefreshed]["4. close"];

    return JSON.stringify({ snapshot: latestPrice });
  },
  {
    name: "fetch_price_snapshot_from_intraday",
    description:
      "This tool is called to retrieve the price snapshot calculated from the intraday stock price for a given company.",
    schema,
  }
);

export default priceSnapshotFromIntradayTool;
