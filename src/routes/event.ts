import { Router } from "express";
import { searchMenuItemsByKeyword } from "../db/util";
import { ensureConnected } from "../db/util";
import OrderTabModel from "../db/models/OrderTab";
import mapOrderConfirmationToBlockKit from "../slack/blockkit/mappers/confirmOrder";
import { sendMessage } from "../slack/utils";
const eventRouter = Router();

const ORDER_TRIGGERS = ["i would like", "get me", "aquire", "order"];

async function handleOrderMention(req: any, res: any) {
  const trigger = ORDER_TRIGGERS.find((trigger) => req.body.event.text.includes(trigger));
  const query = req.body.event.text.replace(trigger, "");

  // order by mention is deprecated at this point

  return res.end("OK");
}

eventRouter.post("/", async (req, res) => {
  if (req.body.type == "url_verification") {
    return res.end(req.body.challenge);
  }
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
