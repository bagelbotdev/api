import { Router } from 'express';
import { createHash } from 'crypto';
import { ensureConnected } from '../../db/util';
import registration from '../../middlewares/registration';

const identityRouter = Router();
identityRouter.use(registration);

identityRouter.post('/', async (req, res) => {  
  await ensureConnected();

  const iden = createHash('sha256').update(req.userRecord!.bryxcoin_wallet).digest('hex').toUpperCase();
  const tok = Buffer.from(req.userRecord?._id.toString() ?? 'ENOENT USER RECORD').toString('base64');

  return res.end(`Your identity secret is: \`${iden}\`\nYour identity token is \`${tok}\``)
});

export default identityRouter;

