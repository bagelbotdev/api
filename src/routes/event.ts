import { Router } from "express";
const eventRouter = Router();

eventRouter.post("/", (req, res) => {
  console.log(req.body);

  res.end(req.body.challenge);
});

export default eventRouter;
