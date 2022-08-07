export default function cache<P extends any[], R>(fn: (...params: P) => Promise<R>): typeof fn {
  const invocationMap = {} as { [k: string]: R };

  return async function (...params: P): Promise<R> {
    const thisInvocationKey = JSON.stringify(params);
    if (typeof invocationMap[thisInvocationKey] == "undefined")
      invocationMap[thisInvocationKey] = await fn(...params);

    return invocationMap[thisInvocationKey];
  };
}
