import { Router } from 'express';
import { ensureConnected } from '../../db/util';
import OrderTabModel from '../../db/models/OrderTab';
import UserModel from '../../db/models/User';

const tabsRouter = Router();

tabsRouter.get("/", async (req, res) => {
    await ensureConnected();
    const tabs = await OrderTabModel.find({});

    const ret = [];

    for (let { opened_at, opener, balsam_cart_guid, closed } of tabs) {
        const usr = (await UserModel.find({ slack_user_id: opener })).shift()

        ret.push({
            opened_at,
            closed,
            balsam_cart_guid,
            opener: `${usr!.first_name!} ${usr!.last_name!}`
        })
    }

    return res.json(ret);
});

export default tabsRouter;