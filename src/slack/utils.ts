import fetch from "node-fetch";

export function sendInteractionResponse(responseUrl: string, content: string) {
  return fetch(responseUrl, {
    method: "POST",
    body: JSON.stringify({
      text: content,
    }),
  });
}

export function sendMessage(content: string, hidden?: boolean) {
  return fetch("https://hooks.slack.com/services/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", {
    method: "POST",
    body: JSON.stringify({
      text: content,
      ephemeral: !!hidden,
    }),
  });
}
