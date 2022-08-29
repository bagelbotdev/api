import { Router } from 'express';

const resolveCartRouter = Router();

resolveCartRouter.get('/:cartGuid', (req, res) => {
  res.contentType('text/html');
  res.end(`<html><meta name="cart-guid" content="${req.params.cartGuid}"></head><body>You must install <a href="https://github.com/bagelbotdev/cart-resolver">cart-resolver extension</a> to continue.<br /><br />Install the extension and then reload this page.</body></html>`);
});

export default resolveCartRouter;
