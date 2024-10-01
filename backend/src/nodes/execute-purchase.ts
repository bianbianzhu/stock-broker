import { graphAnnotation } from "../graph-state.js";

async function executePurchase(
  state: typeof graphAnnotation.State
): Promise<Partial<typeof graphAnnotation.State>> {
  const { messages } = state;

  return {};
}

export default executePurchase;
