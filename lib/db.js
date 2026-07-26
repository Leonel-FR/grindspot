import postgres from "postgres";

// Reuse the connection pool across hot reloads in development
const sql =
  globalThis.__sql ??
  postgres(process.env.DATABASE_URL, {
    transform: postgres.camel,
  });

if (process.env.NODE_ENV !== "production") globalThis.__sql = sql;

export default sql;
