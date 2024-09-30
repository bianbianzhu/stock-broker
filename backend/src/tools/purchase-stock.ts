import { tool } from "@langchain/core/tools";
import { z } from "zod";

const schema = z.object({
  ticker: z
    .string()
    .optional()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
  companyName: z
    .string()
    .optional()
    .describe(
      "The name of the company. This field should be populated if the ticker is not known"
    ),
  quantity: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("The number of stocks to purchase. Defaults to 1"), // let llm handle the default value???
  maxPrice: z
    .number()
    .positive()
    .optional()
    .describe(
      "The maximum price at which to purchase the stock. Defaults to the current price"
    ),
});
//   .superRefine((data, ctx) => {
//     if (!data.ticker && !data.companyName) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Either a ticker or company name must be provided",
//         path: ["ticker", "companyName"],
//       });
//     }
//   });

const purchaseStockTool = tool(
  (args) => {
    // Zod.refine() or Zod.superRefine() now has a bug that causes the type of the schema to be lost
    return `Please confirm that you want to purchase ${args.quantity} shares of ${args.ticker ?? args.companyName} at ${args.maxPrice ?? "the current price"}`;
  },
  {
    name: "purchase_stock",
    description:
      "This tool should be called when a user wants to purchase a stock",
    schema,
  }
);

export default purchaseStockTool;
