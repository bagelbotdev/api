import { Router } from "express";
import { searchMenuItemsByKeyword } from "../db/util";
import { sendMessage } from "../slack/utils";
const eventRouter = Router();

const ORDER_TRIGGERS = ["i would like", "get me", "aquire", "order"];

async function handleOrderMention(req: any, res: any) {
  const trigger = ORDER_TRIGGERS.find((trigger) => req.body.event.text.includes(trigger));
  const query = req.body.event.text.replace(trigger, "");

  await sendMessage(
    "Someone would like a `" +
      ((await searchMenuItemsByKeyword(query))?.name || "no record found :(") +
      "`"
  );

  return res.end("OK");
}

eventRouter.post("/", async (req, res) => {
  const { event } = req.body;

  if (event.type == "app_mention") {
    for (let trigger of ORDER_TRIGGERS) {
      if (event.text.toLowerCase().includes(trigger.toLowerCase()))
        return await handleOrderMention(req, res);
    }

    res.end("OK");
  }
});

export default eventRouter;
