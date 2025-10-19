import express from "express";
import { allBookings, bookVisit, cancelBooking, createUser, getAllFav, toFav } from "../controllers/userController.js";
import jwtcheck from "../config/auth0Config.js";

const router=express.Router();

router.post("/register",jwtcheck,createUser)
router.post("/bookVisit/:id",jwtcheck,bookVisit)
router.post("/allBookings",allBookings)
router.post("/removeBooking/:id",jwtcheck,cancelBooking)
router.post("/toFav/:rid",jwtcheck,toFav)
router.post("/allFav",jwtcheck,getAllFav)
//router.post("/contact",jwtcheck,getContact)

export{router as userRoute}