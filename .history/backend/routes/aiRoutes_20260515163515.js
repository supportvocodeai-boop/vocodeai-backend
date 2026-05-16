import express from "express";
import { auth } from "../middleware/auth.js";
import { handleAI } from "../controllers/aiController.js";
import rateLimit from "express-rate-limit";
const aiLimiter = rateLimit({
  windowMs: 10 * 1000,

  max: 10,

  message: {
    error: "Too many AI requests",
  },
});
const router = express.Router();

router.post("/",aiLimiter, auth, handleAI);

export default router;