import { Router } from "express";
import { getUnconfirmedTxs } from "../coin/blockchain";
import { getBalance, getBalanceOverTime } from "../coin/payment";
import { getCoinEndpoint, isHostAlive } from "../coin/utils";
import HostModel from "../db/models/Host";
import MenuItemModel from "../db/models/MenuItem";
import OrderModel from "../db/models/Order";
import UserModel from "../db/models/User";
import { ensureConnected } from "../db/util";

const metricsRouter = Router();

metricsRouter.get("/", async (req, res) => {
  await ensureConnected();

  console.log("feching data...");
  const total_orders = (await OrderModel.find({})).length;
  console.log("found total orders");
  const users = await UserModel.find({});
  console.log("found total users");
  const hosts = await HostModel.find({});
  console.log("found total hosts");

  const items_ordered = await MenuItemModel.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "item",
        as: "orders",
      },
    },
    {
      $project: {
        name: 1,
        order_count: {
          $size: "$orders",
        },
      },
    },
    {
      $match: {
        order_count: {
          $gt: 0,
        },
      },
    },
    {
      $sort: {
        order_count: -1,
      },
    },
  ]);

  console.log("found total ordered items");

  const GAUGES = [
    {
      name: "total_orders",
      value: total_orders,
    },
    {
      name: "bryxcoin_total_unconfirmed_tx",
      value: (
        await (
          await fetch(getCoinEndpoint("blockchain/transactions"), {
            headers: { accept: "application/json" },
          })
        ).json()
      ).length,
    },
    {
      name: "bryxcoin_blocks",
      value: (await (await fetch(getCoinEndpoint("blockchain/blocks"))).json()).length,
    },
    {
      name: "total_ordered_usd",
      value: (
        await OrderModel.aggregate([
          {
            $match: {
              future: false,
            },
          },
          {
            $lookup: {
              from: "menuitems",
              localField: "item",
              foreignField: "_id",
              as: "item",
            },
          },
          {
            $unwind: {
              path: "$item",
            },
          },
          {
            $group: {
              _id: 0,
              sum: {
                $sum: "$item.price",
              },
            },
          },
        ])
      ).shift().sum,
    },
  ];

  console.log('getting user balances');

  const USER_COIN_METRICS = await users.reduce(async (acc, cur) => {
    return (
      (await acc) +
      `\nuser_balance{full_name="${cur.first_name} ${cur.last_name}"} ` +
      (await getBalance(cur.bryxcoin_address!))
    );
  }, Promise.resolve("# HELP user_balance the bryxcoin balance of a user\n# TYPE user_balance summary"));

  console.log('getting user order stats');

  const USER_ORDER_METRICS = await users.reduce(async (acc, cur) => {
    return (
      (await acc) +
      `\nuser_orders{full_name="${cur.first_name} ${cur.last_name}"} ` +
      (await OrderModel.find({ user: cur._id }).count())
    );
  }, Promise.resolve("# HELP user_orders number of orders ordered by each user\n# TYPE user_orders summary"));

  console.log('getting top bagel orders');

  const BAGELS_ORDERED = items_ordered.reduce((acc, cur) => {
    return acc + `\nbagels_ordered{name="${cur.name}"} ${cur.order_count}`;
  }, "# HELP bagels_ordered All ordered bagels\n# TYPE bagels_ordered summary");

  console.log("pinging hosts...");

  const HOST_METRICS = await hosts.reduce(async (acc, cur) => {
    return (
      (await acc) +
      `\nhosts{fqdn="${cur.host}",owner="${
        (await UserModel.findOne({ _id: cur.owner_id }))?.first_name
      } ${(await UserModel.findOne({ _id: cur.owner_id }))?.last_name}"} ` +
      +(await isHostAlive(cur.host!))
    );
  }, Promise.resolve("# HELP hosts status of each registered host\n# TYPE hosts summary"));

  console.log("aggregating...");

  const GAUGE_METRICS = GAUGES.reduce(
    (acc, cur) =>
      (acc += `# HELP ${cur.name}\n# TYPE ${cur.name} gauge\n${cur.name} ${cur.value}\n`),
    ""
  );

  console.log('done!');

  return res.end(
    [USER_COIN_METRICS, USER_ORDER_METRICS, GAUGE_METRICS, HOST_METRICS, BAGELS_ORDERED].join("\n")
  );
});

export default metricsRouter;
