import { Router } from 'express';
import { ensureConnected } from '../../db/util';
import HostModel from '../../db/models/Host';

const hostsRouter = Router();

hostsRouter.get('/', async (req, res) => {
    await ensureConnected();
    const hosts = await HostModel.find({ });

    return res.json(hosts);
});

hostsRouter.post('/', async (req, res) => {
    await ensureConnected();
    const { host } = req.body;
    return res.json(await HostModel.create({ host }));
});

hostsRouter.put('/:host/refresh', async (req, res) => {
    await ensureConnected();
    const { host } = req.params;

    const hostRecord = await HostModel.findOne({ host });
    if (!hostRecord) return res.status(404).end('Not Found');

    hostRecord.last_online = Date.now();
    await hostRecord.save();

    return res.json(hostRecord);
});

export default hostsRouter;