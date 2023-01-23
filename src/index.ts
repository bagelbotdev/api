import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from 'cors';

import slashRouter from "./routes/slash";
import healthcheckRouter from "./routes/healthcheck";
import interactionRouter from "./routes/interaction";
import eventRouter from "./routes/event";
import v1Router from "./routes/v1";

const app = express();
const PORT = 8000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("common"));
app.use(cors());

app.use("/slash", slashRouter);
app.use("/interaction", interactionRouter);
app.use("/healthcheck", healthcheckRouter);
app.use("/event", eventRouter);
app.use("/v1", v1Router);

app.get("/", (req, res) => res.redirect("https://bryx.slack.com/archives/C03J2TJNRV2"));

app.listen(PORT, "0.0.0.0", () => console.log("listening on " + PORT));
