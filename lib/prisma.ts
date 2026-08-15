import { PrismaClient } from "@prisma/client";

// Prisma's connection-string pool_timeout only bounds how long a query waits for a free
// connection from the pool — it does NOT bound how long the query itself can take once it
// has one. Node has no built-in script-execution timeout the way PHP does (max_execution_time),
// so a stalled/locked query on the shared MySQL server can otherwise hang a request (and the
// process serving it) forever. This wraps every query, everywhere in the app, in a hard
// deadline — same fail-fast discipline as the SMTP transport timeouts, applied at the one
// choke point all Prisma calls already go through instead of page-by-page.
const QUERY_TIMEOUT_MS = 10_000;

function createPrismaClient() {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          return Promise.race([
            query(args),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error(`DB query timed out after ${QUERY_TIMEOUT_MS}ms: ${model}.${operation}`)),
                QUERY_TIMEOUT_MS
              )
            ),
          ]);
        },
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createPrismaClient> };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
