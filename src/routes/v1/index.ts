import { Router } from 'express';
import usersRouter from './users';
import coinRouter from './coin';
import tabsRouter from './tabs';
import hostsRouter from './hosts';
import transactionsRouter from './transaction';

import cors from 'cors';

const v1Router = Router();

v1Router.use(cors());

v1Router.use('/users', usersRouter);
v1Router.use('/coin', coinRouter);
v1Router.use('/tabs', tabsRouter);
v1Router.use('/transactions', transactionsRouter);
v1Router.use('/hosts', hostsRouter);

export default v1Router;
