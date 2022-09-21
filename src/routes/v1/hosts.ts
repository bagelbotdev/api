import { Router } from 'express';
import { getHostGraph, getRandomHosts, registerNewHost } from '../../coin/hosts';
import { createHash } from 'crypto';
import JWT from 'jsonwebtoken';
import semverCompare from 'semver-compare';
import { min_host_ver } from '../../../package.json';

import pkg from '../../../package.json';
import UserModel from '../../db/models/User';
import { isHostAlive } from '../../coin/utils';
import HostModel from '../../db/models/Host';

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
    const jwt = req.headers.authorization?.split('Bearer ').pop();
    if (!jwt) return res.status(400).json({ resp: 'rejected', justification: 'no present token' });
    const parsed = JWT.decode(jwt);

    console.log('processing join request with token: ' + jwt);

    if (!parsed) return res.status(400).json({ resp: 'rejected', justification: 'malformed token'});
    const { tok, ver, loc } = parsed as { tok: string, ver: string, loc: string };

    // step 1. verify identity
    
    // base64 decode tok to get object id
    const oid = Buffer.from(tok, 'base64').toString('ascii')
    const userRecord = await UserModel.findById(oid);

    if (!userRecord) return res.status(400).json({ resp: 'rejected', justification: 'invalid identity tok' });

    // compute the signing key used for this jwt
    const key = createHash('sha256').update(userRecord!.bryxcoin_wallet ?? 'INVALID').digest('hex').toUpperCase();

    // check that provided key was used to sign the jwt
    try { JWT.verify(jwt, key) } catch { return res.status(400).json({ resp: 'rejected', justification: 'no authority with provided credentials'}); }

    // step 2. verify min version and unique host requirement

    if (semverCompare(min_host_ver, ver) > 0) return res.status(400).json({ resp: 'rejected', justification: 'supplied version is out of compliance' });

    const hostRecord = await HostModel.findOne({ host: loc });
    if (!!hostRecord && hostRecord.owner_id != userRecord._id.toString()) return res.status(400).json({ resp: 'rejected', justification: 'requested host location ' + loc + ' has already been claimed by another user' });

    // step 3. register host

    if (!hostRecord) await HostModel.create({ host: loc, owner_id: userRecord._id.toString() });

    res.status(200).json({ resp: 'permitted' });

    return await registerNewHost(loc, 3);
});


export default hostsRouter;