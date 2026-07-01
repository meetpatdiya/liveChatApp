import express from "express";
import { register, login,logout } from "../controller/authController.js";
import { loginLimiter } from "../middleware/Loginlimit.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", loginLimiter,login);
router.post("/logout",logout);

export default router;
