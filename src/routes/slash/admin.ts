import { Router } from "express";
import registration from "../../middlewares/registration";
import { exit } from "process";
import OrderTabModel from "../../db/models/OrderTab";
import { sendMessage } from "../../slack/utils";
import { newBlock } from "../../coin/blockchain";

const adminRouter = Router();

const ADMIN_SUIDS = [
  "U03FLL26JTV", // Tyler
  "U03F2221TQC", // Alek
];

adminRouter.use(registration);

adminRouter.post("/", async (req, res) => {
  if (!ADMIN_SUIDS.includes(req.userRecord!.slack_user_id))
    return res.end(
      ":no_mouth: Only members of the bagelbot admin team can use `/bbadmin`\nPlease reach out to: " +
        ADMIN_SUIDS.reduce((acc, suid) => {
          return (acc += "<@" + suid + "> ");
        }, "")
    );

  const cmd = req.body.text as string;

  if (/(kill\spod|\s*kp\s*)/.test(cmd)) {
    res.json({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: ":heavy_check_mark: Executing command `kill pod`",
          },
        },
      ],
    });

    exit(1);
  } else if (/(tab\sreopen)/.test(cmd)) {
    const tab = (
      await OrderTabModel.aggregate([
        {
          $sort: {
            opened_at: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
    ).at(0);

    tab.closed = false;
    await tab.save();

    sendMessage(
      `A bagel admin has manually reopened <@${tab.opener!}>'s order tab! They can re-close it with \`/tab close\``,
      "#0cdc73"
    );
    return res.end("`/bbadmin " + cmd + "` -> OK");
  } else if (/(mine\sblock)/.test(cmd)) {
    await newBlock();
    return res.end("`/bbadmin " + cmd + "` -> OK");
  }

  return res.end(":sadge: Could not match any valid action for: `" + cmd + "`");
});

export default adminRouter;
