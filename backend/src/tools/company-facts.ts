import { tool } from "@langchain/core/tools";
import { getFinancialDataset } from "../utils/financial-api-service.js";
import { CompanyFactsResponseSchema } from "../utils/schema.js";
import { z } from "zod";

const schema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
});

const companyFactsTool = tool(
  async (args) => {
    const { ticker } = args;

    const response = await getFinancialDataset({
      endpoint: "/company/facts",
      queryParams: { ticker },
      schema: CompanyFactsResponseSchema,
    });

    return JSON.stringify(response);
  },
  {
    name: "company_facts",
    description:
      "Provides key facts and information about a specified company. The result is a JSON stringified object containing details such as: ticker symbol, company name, CIK number, market capitalization, number of employees, SIC code and description, website URL, listing date, and whether the company is currently active.",
    schema,
  }
);

export default companyFactsTool;
