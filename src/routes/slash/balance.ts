import { Router } from 'express';
import UserModel from '../../db/models/User';
import { getBalance } from '../../coin/payment';
import registration from '../../middlewares/registration';

const balanceRouter = Router();
balanceRouter.use(registration);

balanceRouter.post('/', async (req, res) => {
  const user = await UserModel.findOne({ slack_user_id: req.userRecord!.slack_user_id});
  const balance = await getBalance(user!.bryxcoin_address!);

  if (balance < 0) return res.end('Hang on there! Look\'s like you have a brand new bryxcoin wallet / address. Make sure to reach out to a bagelbot admin about your bryxcoin buyin. You can also just host a bagel tab `/tab open` if you don\'t want to buy in');

  return res.end(`BryxCoin balance for <@${user!.slack_user_id}> (100 BRYX = $1): \`${balance} BRYX\``);
});

export default balanceRouter;

