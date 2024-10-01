import { tool } from "@langchain/core/tools";
import { getFinancialDataset } from "../utils/financial-api-service.js";
import { IncomeStatementResponseSchema } from "../utils/schema.js";
import { z } from "zod";

const schema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
  period: z
    .enum(["quarterly", "ttm", "annual"])
    .optional()
    .default("annual") // why here gives a default value but not in the purchase-stock.ts
    .describe(
      'The period of the income statements. "ttm" stands for trailing twelve months. Example: "annual"'
    ),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .default(5) //
    .describe("The number of income statements to return. Example: 5"),
});

const incomeStatementsTool = tool(
  async (args) => {
    const { ticker, period, limit } = args;

    const response = await getFinancialDataset({
      endpoint: "/financials/income-statements",
      queryParams: { ticker, period, limit: limit.toString() }, // since zod.default() is used, no need to have period: period ?? "annual" or limit: limit ?? 5
      schema: IncomeStatementResponseSchema,
    });

    return JSON.stringify(response);
  },
  {
    name: "fetch_income_statements",
    description:
      "This tool is called when retrieving income statements for a specified company, showing detailed financial performance over a chosen period of time. The output includes key metrics such as revenue, expenses, profits, and per-share data. Specifically, it provides: ticker, calendar date, report period type, revenue, cost of revenue, gross profit, operating expenses, income figures (operating, net, EBIT), tax expenses, earnings per share (basic and diluted), dividends per share, and share count information.",
    schema,
  }
);

export default incomeStatementsTool;

// The .default() method in Zod provides a default value for a schema if the corresponding field is either undefined or not provided during parsing. It does not check whether a default value has been provided by the user; instead, it assigns a default value in the absence of one.

// How it works:

// 	•	If a field is missing or explicitly set to undefined, the .default() method will automatically fill in the specified default value.
// 	•	If a valid value for that field is provided, the default value is ignored, and the provided value is used instead.
