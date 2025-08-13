import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql, { Pool } from "mysql2/promise";
import * as schema from "./schema";

// Extend NodeJS.Global type for dev hot-reload safety
declare global {
  // eslint-disable-next-line no-var
  var _drizzleDb: MySql2Database<typeof schema> | undefined;
  var _mysqlPool: Pool | undefined;
}

// Reuse the pool if already available
const pool: Pool =
  global._mysqlPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL!,
    waitForConnections: true,
    connectionLimit: 10,
  });

const db: MySql2Database<typeof schema> =
  global._drizzleDb ?? drizzle(pool, { schema, mode: "planetscale" });

// Store in global for dev hot-reloading
if (process.env.NODE_ENV !== "production") {
  global._mysqlPool = pool;
  global._drizzleDb = db;
}

export { db };
