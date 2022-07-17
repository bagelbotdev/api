import express from "express";
import morgan from "morgan";

import slashRouter from "./routes/slash";
import healthcheckRouter from "./routes/healthcheck";
import interactionRouter from "./routes/interaction";
import eventRouter from "./routes/event";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("common"));

app.use("/slash", slashRouter);
app.use("/interaction", interactionRouter);
app.use("/healthcheck", healthcheckRouter);
app.use("/event", eventRouter);

app.get("/", (req, res) =>
  res.redirect("https://bryx.slack.com/archives/C03J2TJNRV2")
);

app.listen(PORT, "0.0.0.0", () => console.log("listening on " + PORT));
