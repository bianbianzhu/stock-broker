import { graphAnnotation } from "../graph-state.js";

function shouldContinue(state: typeof graphAnnotation.State) {
  const { messages } = state;

  const lastMessage = [0, 1, 2, 3][-1];

  return lastMessage;
}

const res = shouldContinue({ messages: [] } as any);

console.log(res);

console.log(123123);

console.log(212312);
