import { BaseMessage, isAIMessage } from "@langchain/core/messages";
import { graphAnnotation } from "../graph-state.js";
import { graph } from "../index.js";

type StateSnapshot = Awaited<ReturnType<typeof graph.getState>>;

export function logSnapshot(snapshot: StateSnapshot) {
  const values = snapshot.values as typeof graphAnnotation.State;

  const messages = values.messages.map((message) => {
    const msgType = message._getType();

    if (
      isAIMessage(message) &&
      Array.isArray(message.tool_calls) &&
      message.tool_calls.length > 0
    ) {
      return {
        type: `${msgType.toUpperCase()} with TOOL_CALLS`,
        tool_calls: message.tool_calls.map((tc) => tc.name),
      };
    } else {
      return {
        type: msgType.toUpperCase(),
        content: message.content,
      };
    }
  });

  const writes = snapshot.metadata?.writes;

  if (writes && Object.keys(writes).length > 0) {
    for (const [key, value] of Object.entries(writes)) {
      if (key === "messages") {
        value as BaseMessage[];
      }
    }

    const sp = {
      states: {
        ...values,
        messages,
      },
      next: snapshot.next,
      writes: snapshot.metadata?.writes,
    };

    console.log(`==========${snapshot.metadata?.step}==========`);
    console.log(JSON.stringify(sp, null, 2));
  }
}
