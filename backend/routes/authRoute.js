import express from "express";
import { register, login, getMe, verifyToken, verifyEmail, forgotPassword, verifyReset, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset", verifyReset);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", verifyToken, getMe);

export { router as authRoute };
