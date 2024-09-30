import { tool } from "@langchain/core/tools";
import { getFinancialDataset } from "utils/financial-api-service.js";
import { CashFlowStatementResponseSchema } from "utils/schema.js";
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
      'The period of the cash flow statements. "ttm" stands for trailing twelve months. Example: "annual"'
    ),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .default(5)
    .describe("The number of cash flow statements to return. Example: 5"),
});

const cashflowStatementsTool = tool(
  async (args) => {
    const { ticker, period, limit } = args;

    const response = await getFinancialDataset({
      endpoint: "/financials/cash-flow-statements",
      queryParams: { ticker, period, limit: limit.toString() },
      schema: CashFlowStatementResponseSchema,
    });

    return JSON.stringify(response);
  },
  {
    name: "cashflow_statements",
    description:
      "This tool is called when obtaining cash flow statements for a specified company, detailing the inflows and outflows of cash from operating, investing, and financing activities. The result is a JSON stringified object containing an array of cash flow statements. Each statement includes: ticker, date, report period, net cash flows from operations/investing/financing, depreciation and amortization, share-based compensation, capital expenditure, business and investment acquisitions/disposals, debt and equity issuances/repayments, dividends, change in cash and equivalents, and effect of exchange rate changes.",
    schema,
  }
);

export default cashflowStatementsTool;
