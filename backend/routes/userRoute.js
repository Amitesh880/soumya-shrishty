import express from "express";
import { allBookings, bookVisit, cancelBooking, createUser, getAllFav, toFav } from "../controllers/userController.js";
import { verifyToken } from "../controllers/authController.js";

const router=express.Router();

router.post("/register",createUser)
router.post("/bookVisit/:id",verifyToken,bookVisit)
router.post("/allBookings",verifyToken,allBookings)
router.post("/removeBooking/:id",verifyToken,cancelBooking)
router.post("/toFav/:rid",verifyToken,toFav)
router.post("/allFav",verifyToken,getAllFav)
//router.post("/contact",jwtcheck,getContact)

export{router as userRoute}