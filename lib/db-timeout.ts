// Prisma's own pool_timeout only bounds how long a query waits for a free connection
// from the pool — it does NOT bound how long a query can take once it has one. If the
// shared MySQL server stalls or locks up mid-query, the request (and the Node process
// serving it) can hang indefinitely with nothing catching it. Wrap a query in this so
// the request fails fast instead — same "fail fast on external calls" discipline as the
// SMTP transport timeouts, applied one layer deeper.
export function withDbTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`DB query timed out after ${ms}ms: ${label}`)), ms)
    ),
  ]);
}
