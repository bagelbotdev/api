import fetch from 'node-fetch';
import { cacheWithTimeout } from '../db/caching';
import { isHostAlive } from './utils';

const HOST_SEEDS = [
    'seed01-bxch.erwijet.com',
    'seed02-bxch.erwijet.com',
    'seed03-bxch.erwijet.com'
];

const PROTOCOL = 'https';

//

type HostGraphEnt = {
    host: string,
    edges: string[]
}

//

export async function getDirectPeers(host: string): Promise<string[]> {
    try {
        const res = await fetch(`${PROTOCOL}://${host}/node/peers`, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        })

        return (await res.json()).map((ent: {url: string}) => ent.url);
    } catch { return [] as string[] };
}

export async function getHostGraph(): Promise<HostGraphEnt[]> {
    const hosts = [] as HostGraphEnt[];

    // result cached for 5 seconds
    const exploreHostRec = cacheWithTimeout(async (host: string) => {
        if (hosts.some(ent => ent.host == host) || !(await isHostAlive(host))) return;
        const edges = await getDirectPeers(host);

        hosts.push({
            host,
            edges: await getDirectPeers(host)
        });

        for (let edge of edges) {
            await exploreHostRec(edge);
        }

        return true;
    }, 5 * 1000);

    for (let seed of HOST_SEEDS) {
        await exploreHostRec(seed);
    }

    return hosts;
}

export async function getRandomHosts(count: number): Promise<HostGraphEnt[]> {
    const hosts = await getHostGraph();
    return hosts.sort(() => 0.5 - Math.random()).slice(0, Math.min(count, hosts.length));
}

export async function registerNewHost(host: string, peerCount: number) {
    const peers = await getRandomHosts(peerCount);

    // add host to peer list of each selected peer
    await Promise.all(peers.map(peer =>
        fetch(`${PROTOCOL}://${peer.host}/node/peers`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: host })
        })
    ));

    // add each peer to the peer list of selected host
    await Promise.all(peers.map(peer => 
        fetch(`${PROTOCOL}://${host}/node/peers`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: peer.host })
        })
    ));

    return peers.map(peer => peer.host);
}
