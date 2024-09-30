import { z } from "zod";

export type Result<TData, TError extends string = string> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      error: TError;
    };

type ZodFetcher = <TData>(
  schema: z.Schema<TData>,
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Result<TData>>;

class HttpsError extends Error {
  constructor(public response: Response) {
    super();
  }
}

// https://github.com/mattpocock/zod-fetch/blob/main/src/createZodFetcher.ts
export function createZodFetcher(): ZodFetcher {
  return async (schema, input, init = {}) => {
    try {
      if (init.method === "POST" || init.method === "PUT") {
        init.headers = {
          ...init.headers,
          "Content-Type": "application/json",
        };
      }

      if (init.body && typeof init.body === "object") {
        init.body = JSON.stringify(init.body);
      }

      const response = await fetch(input, { ...init });
      if (!response.ok) {
        throw new HttpsError(response);
      }

      const data = await response.json();

      const result = schema.safeParse(data);

      if (!result.success) {
        throw result.error;
      }

      return { success: true, data: result.data };
    } catch (err) {
      return handleError(err);
    }
  };
}

// The return type of this function is `Result<never, string>`. This makes sure that success is always false and the error is always a string. (Result<false, string> gives TS error)
export function handleError(err: unknown): Result<never, string> {
  if (err instanceof HttpsError) {
    return { success: false, error: `HTTP Error: ${err.response.statusText}` };
  } else if (err instanceof z.ZodError) {
    return { success: false, error: `Zod Error: ${err.message}` };
  } else {
    return { success: false, error: `Unknown Error: ${err}` };
  }
}
