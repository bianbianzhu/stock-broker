import { z } from "zod";
import { createZodFetcher } from "./zod-fetch.js";

type Path = "query";

type Endpoint = `/${Path}`;

type GetAlphaVantageDataParams<T extends Record<string, unknown>> = {
  endpoint: Endpoint;
  queryParams: Record<string, string>;
  schema: z.Schema<T>;
};

export async function getAlphaVantageData<
  TData extends Record<string, unknown>,
>(args: GetAlphaVantageDataParams<TData>) {
  const BASE_URL = "https://www.alphavantage.co";
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    throw new Error("No ALPHA VANTAGE API key provided");
  }

  const searchParams = new URLSearchParams(args.queryParams);
  searchParams.append("apikey", apiKey);

  const url = `${BASE_URL}${args.endpoint}?${searchParams.toString()}`;

  const fetcher = createZodFetcher();

  const response = await fetcher(args.schema, url, {
    method: "GET",
  });

  return response;
}
