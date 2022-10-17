export default function cache<P extends any[], R>(fn: (...params: P) => Promise<R>): typeof fn {
  const invocationMap = {} as { [k: string]: R };

  return async function (...params: P): Promise<R> {
    const thisInvocationKey = JSON.stringify(params);
    if (typeof invocationMap[thisInvocationKey] == "undefined")
      invocationMap[thisInvocationKey] = await fn(...params);

    return invocationMap[thisInvocationKey];
  };
}

export function cacheSync<P extends any[], R extends Exclude<any, Promise<any>>>(
  fn: (...params: P) => R
): typeof fn {
  const invocationMap = {} as { [k: string]: R };

  return function (...params: P) {
    const thisInvocationKey = JSON.stringify(params);
    if (typeof invocationMap[thisInvocationKey] == "undefined")
      invocationMap[thisInvocationKey] = fn(...params);

    return invocationMap[thisInvocationKey];
  };
}

export function cacheWithTimeout<P extends any[], R>(
  fn: (...params: P) => Promise<R>,
  ttl: number
): typeof fn {
  const invocationMap = {} as { [k: string]: R };

  setTimeout(
    () =>
      Object.keys(invocationMap).forEach(
        (key) => invocationMap.hasOwnProperty(key) && delete invocationMap[key]
      ),
    ttl
  );

  return async function (...params: P): Promise<R> {
    const thisInvocationKey = JSON.stringify(params);
    if (typeof invocationMap[thisInvocationKey] == "undefined")
      invocationMap[thisInvocationKey] = await fn(...params);

    return invocationMap[thisInvocationKey];
  };
}
