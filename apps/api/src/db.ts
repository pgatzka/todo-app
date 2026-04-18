import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({
  host: env.pg.host,
  port: env.pg.port,
  user: env.pg.user,
  password: env.pg.password,
  database: env.pg.database
});
