import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

type StockPurchaseDetails = {
  ticker: string;
  quantity: number;
  maxPrice: number;
};

export const graphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  requestedStockPurchaseDetails: Annotation<StockPurchaseDetails | undefined>,
  purchaseConfirmed: Annotation<boolean | undefined>,
});
