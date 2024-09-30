import { tool } from "@langchain/core/tools";
import { getFinancialDataset } from "../utils/financial-api-service.js";
import { BalanceSheetResponseSchema } from "../utils/schema.js";
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
    .default("annual")
    .describe(
      'The period of the balance sheets. "ttm" stands for trailing twelve months. Example: "annual"'
    ),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .default(5)
    .describe("The number of balance sheets to return. Example: 5"),
});

const balanceSheetsTool = tool(
  async (args) => {
    const { ticker, period, limit } = args;

    const response = await getFinancialDataset({
      endpoint: "/financials/balance-sheets",
      queryParams: { ticker, period, limit: limit.toString() },
      schema: BalanceSheetResponseSchema,
    });

    return JSON.stringify(response);
  },
  {
    name: "balance_sheets",
    description:
      "This tool is used to fetch balance sheets for a given company, providing a snapshot of its financial position at specific points in time. The output includes detailed information on assets (total, current, non-current), liabilities (total, current, non-current), and shareholders' equity. Specific data points include cash and equivalents, inventory, investments, property/plant/equipment, goodwill, debt, payables, retained earnings, and more. The result is a JSON stringified object containing an array of balance sheets.",
    schema,
  }
);

export default balanceSheetsTool;
