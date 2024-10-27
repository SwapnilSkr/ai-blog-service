import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import { passport } from "../strategies/local.strategy";
import { passport as googlePassport } from "../strategies/google.strategy";

const router = Router();

router.post("/register", passport.authenticate("local-signup"), registerUser);
router.post("/login", passport.authenticate("local-login"), loginUser);
router.get(
  "/google",
  googlePassport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get(
  "/google/callback",
  googlePassport.authenticate("google", { failureRedirect: "/login" }),
  loginUser
);
router.get("/logout", logoutUser);

export default router;
