import { z } from "zod";
import { createZodFetcher, Result } from "./zod-fetch.js";

type Path = "company/facts" | `financials/${Slug}` | "prices/snapshot";

type Slug = "balance-sheets" | "income-statements" | "cash-flow-statements";

type Endpoint = `/${Path}`;

type GetFinancialDatasetParams<T extends Record<string, unknown>> = {
  endpoint: Endpoint;
  queryParams: Record<string, string>; // no need to specify ticker, period, limit here since they will be specified in the tool schema
  schema: z.Schema<T>;
};

export async function getFinancialDataset<
  TData extends Record<string, unknown>,
>(args: GetFinancialDatasetParams<TData>): Promise<Result<TData>> {
  const BASE_URL = "https://api.financialdatasets.ai";
  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY;

  if (!apiKey) {
    throw new Error("No FINANCIAL DATASET API key provided");
  }

  const searchParams = new URLSearchParams(args.queryParams).toString();
  const url = `${BASE_URL}${args.endpoint}?${searchParams}`;

  const fetcher = createZodFetcher();

  const response = await fetcher(args.schema, url, {
    method: "GET",
    headers: { "X-API-KEY": apiKey },
  });

  return response;
}
