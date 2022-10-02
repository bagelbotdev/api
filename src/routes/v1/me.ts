import { json, Router } from "express";
import { createHash } from "crypto";
import JWT from "jsonwebtoken";
import UserModel from "../../db/models/User";
import HostModel from "../../db/models/Host";
import { UserSpec } from "../../db/schemas/User";
import OrderModel from "../../db/models/Order";
import { ensureConnected } from "../../db/util";
import OrderTabModel from "../../db/models/OrderTab";
import MenuItemModel from "../../db/models/MenuItem";
import { getBalanceOverTime } from "../../coin/payment";
import { getSlackProfilePhotoBySlackId } from "../../slack/api/profiles";

const meRouter = Router();

meRouter.use(async (req, res, next) => {
  await ensureConnected();

  const jwt = req.headers.authorization?.split("Bearer ").pop();
  if (!jwt) return res.status(401).end();
  const parsed = JWT.decode(jwt);
  if (!parsed) return res.status(401).end();

  const { tok } = parsed as { tok: string; act: string };
  if (!tok) return res.status(401).end();

  const oid = Buffer.from(tok, "base64").toString("ascii");
  const userRecord = await UserModel.findById(oid);
  if (!userRecord) return res.status(401).end();

  const key = createHash("sha256")
    .update(userRecord!.bryxcoin_wallet ?? "INVALID")
    .digest("hex")
    .toUpperCase();

  try {
    JWT.verify(jwt, key);
  } catch {
    return res.status(401).end();
  }

  req.userRecord = userRecord as UserSpec;

  next();
});

meRouter.get("/orders", async (req, res) => {
  const orderRecords = await OrderModel.find({ user: req.userRecord?._id });
  return res.json(
    await Promise.all(
      orderRecords.map(async (ent) => ({
        created: ent.created,
        tab: ent.tab,
        future: ent.future,
        item_name: (await MenuItemModel.findById(ent.item))!.name ?? "not_found",
        item_price: (await MenuItemModel.findById(ent.item))!.price ?? 0,
      }))
    )
  );
});

meRouter.get("/tabs", async (req, res) => {
  const tabs = await OrderTabModel.find({ opener: req.userRecord?.slack_user_id });
  return res.json(
    await Promise.all(
      tabs.map(async (tab) => {
        const orderRecords = await OrderModel.find({ tab: tab._id });

        return {
          opened_at: tab.opened_at,
          closed: tab.closed,
          orders: await Promise.all(
            orderRecords.map(async (ent) => {
              const user = await UserModel.findById(ent.user).select(
                "first_name last_name slack_user_id"
              );

              return {
                for_user: {
                  first_name: user?.first_name,
                  last_name: user?.last_name,
                  slack_user_id: user?.slack_user_id,
                  profile_image_url: await getSlackProfilePhotoBySlackId(user?.slack_user_id ?? ''),
                },
                item_name: (await MenuItemModel.findById(ent.item))!.name ?? "not_found",
                item_price: (await MenuItemModel.findById(ent.item))!.price ?? 0,
              };
            })
          ),
        };
      })
    )
  );
});

meRouter.get("/coin-history", async (req, res) => {
  const balanceByBlocks = await getBalanceOverTime(req.userRecord!.bryxcoin_address);
  return res.json(balanceByBlocks.filter((v, i, arr) => arr[i - 1] != v));
});

meRouter.get('/photo', async (req, res) => {
  return res.json({ url: await getSlackProfilePhotoBySlackId(req.userRecord?.slack_user_id ?? '')});
});

meRouter.get("/hosts", async (req, res) => {
  return res.json(await HostModel.find({ owner_id: req.userRecord?._id.toString() }));
});

export default meRouter;
