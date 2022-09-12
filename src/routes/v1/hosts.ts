import { json, Router } from 'express';
import { ensureConnected } from '../../db/util';
import HostModel from '../../db/models/Host';
import { isHostAlive } from '../../coin/utils';
import { getHostGraph, getRandomHosts, registerNewHost } from '../../coin/hosts';

const hostsRouter = Router();


hostsRouter.get('/', async (req, res) => {
    return res.json(await getHostGraph());
});

hostsRouter.get('/rand/:n', async (req, res) => {
    const { n } = req.params;
    return res.json(await getRandomHosts(Number.parseInt(n)));
});

// hostsRouter.get('/', async (req, res) => {
//     await ensureConnected();
//     const hosts = await HostModel.find({ });

//     return res.json(hosts);
// });

hostsRouter.post('/', async (req, res) => {
    const { host } = req.body;
    return res.json(await registerNewHost(host, 3));
});

// hostsRouter.put('/:host/refresh', async (req, res) => {
//     await ensureConnected();
//     const { host } = req.params;

//     const hostRecord = await HostModel.findOne({ host });
//     if (!hostRecord) return res.status(404).end('Not Found');

//     hostRecord.last_online = Date.now();
//     await hostRecord.save();

//     return res.json(hostRecord);
// });

// hostsRouter.delete('/:host', async (req, res) => {
//     await ensureConnected();
//     const { host } = req.params;

//     const hostRecord = await HostModel.findOne({ host });
//     if (!hostRecord) return res.status(404).end('Not Found');

//     if (await isHostAlive(host)) return res.status(400).end('Illegal. Host is alive');

//     await hostRecord.delete();
//     return res.status(204).end();
// });

export default hostsRouter;