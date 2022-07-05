import { Router } from "express";
import { queryFromBalsam } from "../../balsam/gqlClient";
import { MENUS_QUERY } from "../../../gql/menus.gql";
import mapMenuResToBlockKit from "../../blockkit/mappers/menu";
import invalidMenuResp from "../../blockkit/prefab/invalid-menu-resp.json";
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
  console.log(req.body);

  const gqlRes = await queryFromBalsam(MENUS_QUERY);

  const selectedMenu = req.body.text || "--INVALID--";

  if (!Object.keys(MENU_MAPPINGS).includes(selectedMenu))
    return res.json(invalidMenuResp);
  else
    return res.json({
      blocks: mapMenuResToBlockKit(
        MENU_MAPPINGS[selectedMenu as keyof typeof MENU_MAPPINGS],
        gqlRes.data.menusV3.menus
      ),
    });
});
export default menuRouter;
