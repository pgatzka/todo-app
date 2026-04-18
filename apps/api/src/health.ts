import type { FastifyPluginAsync } from "fastify";
import { pool } from "./db.js";

export const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_req, reply) => {
    try {
      await pool.query("SELECT 1");
      return { ok: true, db: "connected" as const };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return reply.code(503).send({ ok: false, db: "error" as const, message });
    }
  });
};
