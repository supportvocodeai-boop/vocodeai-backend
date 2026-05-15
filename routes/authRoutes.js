import express from "express";
import passport from "../config/passport.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL;
router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",       
    accessType: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    req.user.refreshToken = refreshToken;
    await req.user.save();

   res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.redirect(`${FRONTEND_URL}/oauth-success`);
  }
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;