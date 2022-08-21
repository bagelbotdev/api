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
  return fetch(process.env.SLACKBOT_WEBHOOK!, {
    method: "POST",
    body: JSON.stringify({
      text: content,
      ephemeral: !!hidden,
    }),
  });
}
