import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const graphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  requestedStockPurchaseDetails: Annotation<string>,
  purchaseConfirmed: Annotation<boolean | undefined>,
});
