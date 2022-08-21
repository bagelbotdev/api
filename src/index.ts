import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import slashRouter from "./routes/slash";
import healthcheckRouter from "./routes/healthcheck";
import interactionRouter from "./routes/interaction";
import eventRouter from "./routes/event";

const app = express();
const PORT = 8000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("common"));

app.use("/slash", slashRouter);
app.use("/interaction", interactionRouter);
app.use("/healthcheck", healthcheckRouter);
app.use("/event", eventRouter);

app.get("/", (req, res) => res.redirect("https://bryx.slack.com/archives/C03J2TJNRV2"));

app.get("/doc", (req, res) =>
  res.redirect(
    "https://docs.google.com/document/d/1gPcZ1OuE-FlktDkrFvKx0gxcydmoJ-bQjCh1bPUptjE/edit"
  )
);

app.get("/kube", (req, res) =>
  res.redirect(
    "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/job?namespace=bagelbot"
  )
);

app.listen(PORT, "0.0.0.0", () => console.log("listening on " + PORT));
