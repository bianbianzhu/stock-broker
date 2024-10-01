import { z } from "zod";

/**
 * ----------------------------------------------------
 * ------------------ /company/facts ------------------
 * ----------------------------------------------------
 */
export const CompanyFactsSchema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
  name: z.string().describe("The name of the company"),
  cik: z
    .string()
    .refine((value) => value.length === 10)
    .describe(
      "The CIK (Central Index Key) is a unique 10-digit identifier assigned by the SEC to entities that file with it, used to track and access their filings in the EDGAR database."
    ),
  market_cap: z
    .number()
    .describe(
      "The total market value of a company's outstanding shares of stock"
    ),
  number_of_employees: z
    .number()
    .describe("The number of employees working for the company"),
  sic_code: z
    .string()
    .refine((value) => value.length === 4)
    .describe(
      "A SIC (Standard Industrial Classification) code is a four-digit numerical code assigned by the U.S. government to classify businesses by their industry or economic activity."
    ),
  sic_description: z.string().describe("The description of the SIC code"),
  website_url: z.string().url().describe("The company's website URL"),
  listing_date: z.string().describe("The date the company was listed"),
  is_active: z.boolean().describe("Whether the company is currently active"),
});

// To meet the API requirements, we need to wrap the schema in an object with the corresponding key
export const CompanyFactsResponseSchema = z.object({
  company_facts: CompanyFactsSchema,
});

export type CompanyFactsResponse = z.infer<typeof CompanyFactsResponseSchema>;

/**
 * ----------------------------------------------------
 * ---------- /financials/income-statements -----------
 * ----------------------------------------------------
 */
export const IncomeStatementSchema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
  calendar_date: z
    .string()
    .describe(
      "The specific end date for which the financial performance of a company is reported"
    ),
  report_period: z
    .string()
    .describe(
      "the specific time frame during which the financial performance is measured"
    ),
  period: z
    .enum(["quarterly", "ttm", "annual"])
    .describe(
      'The period of the report. "ttm" stands for trailing twelve months'
    ),
  revenue: z
    .number()
    .describe(
      "The total revenue from sales of goods or services before any costs or expenses are deducted"
    ),
  cost_of_revenue: z
    .number()
    .describe(
      "the total direct costs associated with producing and delivering a company’s goods or services"
    ),
  gross_profit: z
    .number()
    .describe("the total revenue minus the cost of revenue"),
  operating_expense: z
    .number()
    .describe(
      "the costs a company incurs during its regular business operations, excluding the cost of goods sold (COGS), and typically include expenses like rent, salaries, utilities, and marketing"
    ),
  selling_general_and_administrative_expenses: z
    .number()
    .describe(
      "the combined costs of operating a business, including expenses related to selling products (such as marketing and sales commissions), as well as general administrative costs like salaries, office supplies, and management overhead."
    ),
  research_and_development: z
    .number()
    .describe("The total research and development expenses"),
  operating_income: z
    .number()
    .describe(
      "a company’s profit after deducting operating expenses (such as SG&A and COGS) from its revenue, reflecting the earnings generated from its core business operations before interest and taxes"
    ),
  interest_expense: z
    .number()
    .describe(
      "the cost incurred by a company for borrowing funds, representing the interest paid on debt such as loans, bonds, or other financial obligations"
    ),
  ebit: z.number().describe("Earnings before interest and taxes"),
  income_tax_expense: z
    .number()
    .describe(
      "the amount of taxes a company owes to the government based on its taxable income, typically calculated as a percentage of earnings before taxes"
    ),
  net_income_discontinued_operations: z
    .number()
    .describe(
      "the profit or loss generated from a business segment or operation that has been sold, closed, or otherwise discontinued, and is reported separately from continuing operations on the income statement."
    ),
  net_income_non_controlling_interests: z
    .number()
    .describe(
      "the portion of a subsidiary’s net income that is attributable to minority shareholders who do not have full ownership of the subsidiary, and it is excluded from the parent company’s net income."
    ),
  net_income: z
    .number()
    .describe(
      "total profit a company earns after deducting all expenses, including operating costs, interest, taxes, and any other expenses, from its total revenue. It represents the company’s bottom line and is also known as net profit or net earnings."
    ),
  net_income_common_stock: z
    .number()
    .describe(
      "the portion of a company’s net income that is available to common shareholders after preferred dividends (if any) have been paid, representing the earnings that can potentially be distributed as dividends or retained by the company."
    ),
  preferred_dividends_impact: z
    .number()
    .describe(
      "the reduction in net income available to common shareholders due to dividends that must first be paid to preferred shareholders, which affects the calculation of earnings per share (EPS) for common stockholders."
    ),
  consolidated_income: z
    .number()
    .describe(
      "the total net income of a parent company and its subsidiaries, combined into a single financial statement, after eliminating intercompany transactions and adjusting for non-controlling interests."
    ),
  earnings_per_share: z
    .number()
    .describe(
      "a financial metric that represents the portion of a company’s net income allocated to each outstanding share of common stock, calculated as net income divided by the weighted average number of shares outstanding during a specific period"
    ),
  earnings_per_share_diluted: z
    .number()
    .describe(
      "A financial metric that calculates the portion of a company's net income available to each share, assuming all potential dilutive securities (such as stock options, convertible bonds, and warrants) are converted into common shares."
    ),
  dividends_per_common_share: z
    .number()
    .describe(
      "A financial metric that represents the actual dividends paid out to each outstanding common share of a company."
    ),
  weighted_average_shares: z
    .number()
    .describe(
      "the average number of a company’s outstanding shares over a reporting period, accounting for changes such as stock issuances or buybacks"
    ),
  weighted_average_shares_diluted: z
    .number()
    .describe(
      "the total number of shares outstanding, adjusted for potential dilution from convertible securities, used to calculate diluted earnings per share (EPS)"
    ),
});

export const IncomeStatementResponseSchema = z.object({
  income_statements: z.array(IncomeStatementSchema),
});

export type IncomeStatementResponse = z.infer<
  typeof IncomeStatementResponseSchema
>;

/**
 * ----------------------------------------------------
 * ------------ /financials/balance-sheets ------------
 * ----------------------------------------------------
 */
const BalanceSheetSchema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks."
    ),

  calendar_date: z
    .string()
    .describe(
      "The specific end date for which the financial position of a company is reported."
    ),

  report_period: z
    .string()
    .describe(
      "The specific time frame during which the financial position is measured, such as a quarter or a fiscal year."
    ),

  period: z
    .enum(["quarterly", "ttm", "annual"])
    .describe(
      'The period of the report. "ttm" stands for trailing twelve months.'
    ),

  total_assets: z
    .number()
    .describe(
      "The sum of all assets owned by a company, including current and non-current assets."
    ),

  current_assets: z
    .number()
    .describe(
      "Assets that are expected to be converted into cash, sold, or consumed within one year, such as cash, inventory, and receivables."
    ),

  cash_and_equivalents: z
    .number()
    .describe(
      "Highly liquid assets that are readily convertible to cash, including cash on hand, bank accounts, and short-term investments."
    ),

  inventory: z
    .number()
    .describe(
      "The value of a company's raw materials, work-in-progress, and finished goods that are held for sale."
    ),

  current_investments: z
    .number()
    .describe(
      "Short-term investments that are expected to be liquidated or converted into cash within one year."
    ),

  trade_and_non_trade_receivables: z
    .number()
    .describe(
      "Amounts owed to the company by customers and other parties, including both trade (related to sales) and non-trade (other) receivables."
    ),

  non_current_assets: z
    .number()
    .describe(
      "Assets that are not expected to be converted into cash within one year, such as property, plant, equipment, and intangible assets."
    ),

  property_plant_and_equipment: z
    .number()
    .describe(
      "Tangible long-term assets used in the operations of a business, including land, buildings, machinery, and equipment."
    ),

  goodwill_and_intangible_assets: z
    .number()
    .describe(
      "Non-physical assets that provide long-term value, such as goodwill, patents, trademarks, and copyrights."
    ),

  investments: z
    .number()
    .describe(
      "Long-term investments in securities or other companies that are not intended to be sold in the short term."
    ),

  non_current_investments: z
    .number()
    .describe(
      "Investments that are not expected to be liquidated within one year, including long-term holdings in stocks, bonds, or other financial instruments."
    ),

  outstanding_shares: z
    .number()
    .describe(
      "The total number of shares of common stock that are currently owned by all shareholders, including shares held by institutional investors and company insiders."
    ),

  tax_assets: z
    .number()
    .describe(
      "Amounts expected to be recovered through future tax benefits, such as deferred tax assets arising from deductible temporary differences."
    ),

  total_liabilities: z
    .number()
    .describe(
      "The sum of all financial obligations a company owes, including both current and non-current liabilities."
    ),

  current_liabilities: z
    .number()
    .describe(
      "Obligations a company needs to settle within one year, such as accounts payable, short-term debt, and other current liabilities."
    ),

  current_debt: z
    .number()
    .describe(
      "Short-term borrowings and obligations that are due within one year, including loans, lines of credit, and the current portion of long-term debt."
    ),

  trade_and_non_trade_payables: z
    .number()
    .describe(
      "Amounts a company owes to suppliers and other parties, including both trade payables (related to purchases) and non-trade payables (other obligations)."
    ),

  deferred_revenue: z
    .number()
    .describe(
      "Payments received in advance for goods or services that are to be delivered or performed in the future."
    ),

  deposit_liabilities: z
    .number()
    .describe(
      "Amounts held as deposits from customers or other parties, which are expected to be returned or applied against future obligations."
    ),

  non_current_liabilities: z
    .number()
    .describe(
      "Obligations that are not due within one year, including long-term debt, pension liabilities, and deferred tax liabilities."
    ),

  non_current_debt: z
    .number()
    .describe(
      "Long-term borrowings and financial obligations that are due beyond one year, such as bonds, mortgages, and long-term loans."
    ),

  tax_liabilities: z
    .number()
    .describe(
      "Amounts owed to tax authorities, including current tax liabilities and deferred tax liabilities."
    ),

  shareholders_equity: z
    .number()
    .describe(
      "The residual interest in the assets of a company after deducting liabilities, representing the owners' claim on the company's assets."
    ),

  retained_earnings: z
    .number()
    .describe(
      "Accumulated net income that is retained by the company rather than distributed to shareholders as dividends."
    ),

  accumulated_other_comprehensive_income: z
    .number()
    .describe(
      "Accumulated gains and losses that are not included in net income, such as foreign currency translation adjustments and unrealized gains/losses on securities."
    ),

  total_debt: z
    .number()
    .describe(
      "The sum of all interest-bearing debt, including both current and non-current debt obligations."
    ),
});

export const BalanceSheetResponseSchema = z.object({
  balance_sheets: z.array(BalanceSheetSchema),
});

export type BalanceSheetResponse = z.infer<typeof BalanceSheetResponseSchema>;

/**
 * ----------------------------------------------------
 * --------- /financials/cash-flow-statements ---------
 * ----------------------------------------------------
 */
const CashFlowStatementSchema = z.object({
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks, used to identify the company on stock exchanges."
    ),

  calendar_date: z
    .string()
    .describe(
      "The specific end date for which the cash flow of a company is reported."
    ),

  report_period: z
    .string()
    .describe(
      "The specific time frame during which the cash flow is measured, such as a quarter or a fiscal year."
    ),

  period: z
    .enum(["quarterly", "ttm", "annual"])
    .describe(
      'The period of the report. "ttm" stands for trailing twelve months.'
    ),

  net_cash_flow_from_operations: z
    .number()
    .describe(
      "The net amount of cash generated or used by a company's core business operations during the reporting period."
    ),

  depreciation_and_amortization: z
    .number()
    .describe(
      "The total depreciation and amortization expenses, reflecting the allocation of the cost of tangible and intangible assets over their useful lives."
    ),

  share_based_compensation: z
    .number()
    .describe(
      "The total expense related to share-based compensation, such as stock options or grants, provided to employees and executives."
    ),

  net_cash_flow_from_investing: z
    .number()
    .describe(
      "The net amount of cash used in or provided by a company's investing activities, including the purchase and sale of assets and investments."
    ),

  capital_expenditure: z
    .number()
    .describe(
      "The total amount spent on acquiring or maintaining fixed assets, such as property, plant, and equipment."
    ),

  business_acquisitions_and_disposals: z
    .number()
    .describe(
      "The net cash flow related to the acquisition and disposal of business units or subsidiaries."
    ),

  investment_acquisitions_and_disposals: z
    .number()
    .describe(
      "The net cash flow related to the purchase and sale of investments, such as securities or stakes in other companies."
    ),

  net_cash_flow_from_financing: z
    .number()
    .describe(
      "The net amount of cash raised or repaid through a company's financing activities, including debt and equity transactions."
    ),

  issuance_or_repayment_of_debt_securities: z
    .number()
    .describe(
      "The net cash flow from issuing or repaying debt securities, such as bonds or loans."
    ),

  issuance_or_purchase_of_equity_shares: z
    .number()
    .describe(
      "The net cash flow from issuing new equity shares or repurchasing existing shares."
    ),

  dividends_and_other_cash_distributions: z
    .number()
    .describe(
      "The total cash paid out to shareholders as dividends and other cash distributions."
    ),

  change_in_cash_and_equivalents: z
    .number()
    .describe(
      "The overall increase or decrease in a company's cash and cash equivalents during the reporting period."
    ),

  effect_of_exchange_rate_changes: z
    .number()
    .describe(
      "The impact of fluctuations in foreign exchange rates on a company's cash and cash equivalents."
    ),
});

export const CashFlowStatementResponseSchema = z.object({
  cash_flow_statements: z.array(CashFlowStatementSchema),
});

export type CashFlowStatementResponse = z.infer<
  typeof CashFlowStatementResponseSchema
>;

/**
 * ----------------------------------------------------
 * --------- /prices/snapshot ---------
 * ----------------------------------------------------
 */

const SnapshotSchema = z.object({
  price: z.number().describe("The current price of the stock in the market"),
  ticker: z
    .string()
    .describe(
      "A unique series of letters or characters assigned to publicly traded stocks"
    ),
  day_change: z
    .number()
    .describe(
      "The change in price of the stock since the previous trading day"
    ),
  day_change_percent: z
    .number()
    .describe(
      "The percentage change in price of the stock since the previous trading day"
    ),
  time: z
    .string()
    .describe("The time at which the snapshot of the stock price was taken"),
  time_nanoseconds: z
    .number()
    .describe(
      "The time at which the snapshot of the stock price was taken in nanoseconds"
    ),
});

export const SnapshotResponseSchema = z.object({
  snapshot: SnapshotSchema,
});

export type SnapshotResponse = z.infer<typeof SnapshotResponseSchema>;

/**
 * ----------------------------------------------------
 * --------- Alpha Vantage Stock ---------
 * -------------/query TIME_SERIES_DAILY--------------------------
 */

export const TimeSeriesDailySchema = z.object({
  "Meta Data": z
    .object({
      "1. Information": z
        .string()
        .describe(
          "The information about the data. Example: Daily Prices (open, high, low, close) and Volumes"
        ),
      "2. Symbol": z.string().describe("The stock symbol. Example: IBM"),
      "3. Last Refreshed": z.string().describe("The last refreshed date"),
      "4. Output Size": z
        .enum(["Compact", "Full"])
        .describe(
          "The output size of the data. Compact returns only the latest 100 data points; Full returns the full-length time series of 20+ years of historical data"
        ),
      "5. Time Zone": z
        .string()
        .describe("The time zone of the data. Example: US/Eastern"),
    })
    .describe("The metadata of the time series data"),
  "Time Series (Daily)": z.record(
    z.string().date().describe("The date of the data point"),
    z.object({
      "1. open": z
        .string()
        .describe("The opening price of the stock on that day"),
      "2. high": z
        .string()
        .describe("The highest price of the stock on that day"),
      "3. low": z
        .string()
        .describe("The lowest price of the stock on that day"),
      "4. close": z
        .string()
        .describe("The closing price of the stock on that day"),
      "5. volume": z.string().describe("The volume of the stock on that day"),
    })
  ),
});

// In Zod, z.record() creates a schema for an object with dynamic keys. It allows you to specify the types of both the keys and the values in the object, offering flexibility when you don’t know the exact key names ahead of time but still need to validate their types.

// z.record(keySchema, valueSchema)

// •	keySchema (optional): The type of the object keys (defaults to z.string() if not provided).
// •	valueSchema: The type of the values associated with each key.

export type TimeSeriesDailyResponse = z.infer<typeof TimeSeriesDailySchema>;

/**
 * ----------------------------------------------------
 * --------- Alpha Vantage Stock ---------
 * -------------/query TIME_SERIES_INTRADAY--------------------------
 */

const IntervalSchema = z
  .enum(["1min", "5min", "15min", "30min", "60min"])
  .describe(
    "The time interval between two consecutive data points. Example: 5min"
  );

/**
 * This function dynamically creates a schema for the Time Series Intraday data based on the interval provided. Example: TimeSeriesIntradaySchema("5min") -> `Time Series (5min)`
 * @param interval Enum value: "1min", "5min", "15min", "30min", "60min"
 * @returns a Zod schema for the Time Series Intraday data
 */
export const TimeSeriesIntradaySchema = (
  interval: z.infer<typeof IntervalSchema>
) =>
  z.object({
    "Meta Data": z
      .object({
        "1. Information": z
          .string()
          .describe("Intraday (1min) open, high, low, close prices and volume"),
        "2. Symbol": z.string().describe("The stock symbol. Example: IBM"),
        "3. Last Refreshed": z.string().describe("The last refreshed date"),
        "4. Interval": IntervalSchema,
        "5. Output Size": z
          .enum(["Compact", "Full"])
          .describe(
            "The output size of the data. Compact returns only the latest 100 data points in the intraday time series; Full returns trailing 30 days of the most recent intraday data"
          ),
        "6. Time Zone": z
          .string()
          .describe("The time zone of the data. Example: US/Eastern"),
      })
      .describe("The metadata of the time series data"),
    [`Time Series (${interval})`]: z.record(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
          message: "Datetime must be in YYYY-MM-DD HH:mm:ss format",
        })
        .describe(
          "The date time of the data point in the format YYYY-MM-DD HH:mm:ss. Example: 2024-09-27 19:59:00 "
        ),
      z.object({
        "1. open": z
          .string()
          .describe("The opening price of the stock on that day"),
        "2. high": z
          .string()
          .describe("The highest price of the stock on that day"),
        "3. low": z
          .string()
          .describe("The lowest price of the stock on that day"),
        "4. close": z
          .string()
          .describe("The closing price of the stock on that day"),
        "5. volume": z.string().describe("The volume of the stock on that day"),
      })
    ),
  });
