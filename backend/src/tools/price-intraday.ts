import { tool } from "@langchain/core/tools";
import { getAlphaVantageData } from "../utils/alpha-vantage-service.js";
import { TimeSeriesIntradaySchema } from "../utils/schema.js";
import { z } from "zod";

const schema = z.object({
  symbol: z
    .string()
    .describe("The name of the equity of your choice. For example: IBM"),
  interval: z
    .enum(["1min", "5min", "15min", "30min", "60min"])
    .optional()
    .default("1min")
    .describe(
      "The interval of time between two consecutive data points in the time series. Example: 1min"
    ),
});

const priceIntradayTool = tool(
  async (args) => {
    const { symbol, interval } = args;

    const FUNCTION_NAME = "TIME_SERIES_INTRADAY";

    const response = await getAlphaVantageData({
      endpoint: "/query",
      queryParams: {
        symbol,
        interval, // default is 1min
        function: FUNCTION_NAME,
      },
      schema: TimeSeriesIntradaySchema(interval),
    });

    return JSON.stringify(response);
  },
  {
    name: "fetch_price_intraday",
    description:
      "This tool is called to retrieve the intraday stock price for a given company. The intraday price is the price of a stock during a single trading day. It returns the opening price, closing price, high price, low price, and volume of the stock at a time interval in the time series.",
    schema,
  }
);

export default priceIntradayTool;
