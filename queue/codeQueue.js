import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const codeQueue = new Queue("code-execution", {
  connection: redisConnection,
});