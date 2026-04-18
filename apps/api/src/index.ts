import Fastify from "fastify";
import { env } from "./env.js";
import { healthRoute } from "./health.js";

const app = Fastify({ logger: true });

await app.register(healthRoute, { prefix: "/api" });

try {
  await app.listen({ port: env.apiPort, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
