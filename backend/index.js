import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();
const app = express();
// PORT definition is unnecessary in a serverless export environment

// Define CORS options using the allowed origins you specified
const corsOptions = {
    origin: ["https://real-estate-project-henna-seven.vercel.app", "http://localhost:5173"],
    withCredentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(express.json());
app.use(cookieParser());

// Use CORS middleware (this handles all preflight OPTIONS requests automatically)
app.use(cors(corsOptions));

// FIX: Removed the problematic line 'app.options("*", cors(corsOptions))'
// which was causing the PathError due to a conflict with '*' and path-to-regexp.


// Routes
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Vercel Serverless Export (Replaces app.listen)
export default app;
