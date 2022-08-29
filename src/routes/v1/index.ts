import { Router } from 'express';
import usersRouter from './users';
import coinRouter from './coin';
import tabsRouter from './tabs';
import transactionsRouter from './transaction';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/coin', coinRouter);
v1Router.use('/tabs', tabsRouter);
v1Router.use('/transactions', transactionsRouter);

export default v1Router;
