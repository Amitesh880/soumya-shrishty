import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// --- CORS Configuration (Kept for robustness) ---
const allowedOrigins = "*"; 

const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    allowedHeaders: "Content-Type,Authorization", 
    credentials: true, 
    optionsSuccessStatus: 204
};

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- Routes ---
app.use("/api/User", userRoute);
app.use("/api/residency", residencyRoute);

// --- Vercel Serverless Export ---
// 1. Remove app.listen()
// 2. Export the 'app' instance as the handler
export default app; 