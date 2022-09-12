import { Router } from 'express';
import { getHostGraph, getRandomHosts, registerNewHost } from '../../coin/hosts';

import pkg from '../../../package.json';

const hostsRouter = Router();


hostsRouter.get('/', async (req, res) => {
    return res.json(await getHostGraph());
});

hostsRouter.get('/rand/:n', async (req, res) => {
    const { n } = req.params;
    return res.json(await getRandomHosts(Number.parseInt(n)));
});

hostsRouter.get('/meta/compliance', (req, res) => {
    return res.json({
        min_version: (pkg as typeof pkg & { min_host_ver: string }).min_host_ver
    })
});

hostsRouter.post('/', async (req, res) => {
    const { host } = req.body;
    return res.json(await registerNewHost(host, 3));
});


export default hostsRouter;