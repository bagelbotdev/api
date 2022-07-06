import fetch from "node-fetch";

export function sendInteractionResponse(responseUrl: string, content: string) {
  return fetch(responseUrl, {
    method: "POST",
    body: JSON.stringify({
      text: content,
    }),
  });
}
