import { Router } from "express";
import registration from "../../middlewares/registration";
import { exit } from "process";

const adminRouter = Router();

const ADMIN_SUIDS = [
  "U03FLL26JTV", // Tyler
  "U03F2221TQC", // Alek
];

adminRouter.use(registration);

adminRouter.post("/", (req, res) => {
  if (!ADMIN_SUIDS.includes(req.userRecord!.slack_user_id))
    return res.end(
      ":no_mouth: Only members of the bagelbot admin team can use `/bbadmin`\nPlease reach out to: " +
        ADMIN_SUIDS.reduce((acc, suid) => {
          return (acc += "<@" + suid + "> ");
        }, "")
    );

  const cmd = req.body.text;

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
  }

  return res.end(":sadge: Could not match any valid action for: `" + cmd + "`");
});

export default adminRouter;
