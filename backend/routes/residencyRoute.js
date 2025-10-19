import express from "express";
import { createResidency, getAllResidencies, getResidency } from "../controllers/residencyController.js";
import jwtcheck from "../config/auth0Config.js";
const router=express.Router();
router.post("/create",jwtcheck,createResidency)
router.get("/allresd",getAllResidencies)
router.get("/:id",getResidency)

export{router as residencyRoute}