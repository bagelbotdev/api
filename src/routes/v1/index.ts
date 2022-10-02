import { Router } from 'express';
import usersRouter from './users';
import coinRouter from './coin';
import tabsRouter from './tabs';
import hostsRouter from './hosts';
import meRouter from './me';

import cors from 'cors';

const v1Router = Router();

v1Router.use(cors());

v1Router.use('/users', usersRouter);
v1Router.use('/coin', coinRouter);
v1Router.use('/tabs', tabsRouter);
v1Router.use('/hosts', hostsRouter);
v1Router.use('/me', meRouter);

export default v1Router;
