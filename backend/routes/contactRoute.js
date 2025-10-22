import express from "express";
import { 
  createContactMessage, 
  getAllContactMessages, 
  getUserContactMessages, 
  deleteContactMessage 
} from "../controllers/contactController.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

// Create a new contact message (requires authentication)
router.post("/message", verifyToken, createContactMessage);

// Get all contact messages (admin route - requires authentication)
router.get("/all", verifyToken, getAllContactMessages);

// Get user's own contact messages (requires authentication)
router.get("/my-messages", verifyToken, getUserContactMessages);

// Delete a contact message (requires authentication)
router.delete("/:id", verifyToken, deleteContactMessage);

export { router as contactRoute };