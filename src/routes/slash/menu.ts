import { Router } from "express";
import { queryFromBalsam } from "../../balsam/utils";
import { MENUS_QUERY } from "../../../gql/menus.gql";
import mapMenuResToBlockKit from "../../slack/blockkit/mappers/menu";
import invalidMenuResp from "../../slack/blockkit/prefab/invalid-menu-resp.json";
import registration from "../../middlewares/registration";

const menuRouter = Router();
menuRouter.use(registration); // require users to be registered

const MENU_MAPPINGS = {
  bagels: "BULK BAGELS/ TUBS OF CREAM CHEESE",
  breakfast: "BREAKFAST SANDWICHES",
  soups: "SANDWICHES/SOUPS",
  pastries: "PASTRIES",
  vegan: "VEGAN MENU",
};

menuRouter.post("/", async (req, res) => {
  return res.end("this command is deprecated!");
});

export default menuRouter;
