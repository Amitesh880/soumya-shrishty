import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { authRoute } from "./routes/authRoute.js";

dotenv.config();
const app = express();

// Define CORS options
const corsOptions = {
    origin: [
        "https://real-estate-project-henna-seven.vercel.app",
        "http://soumyasrishtyproperties.com",
        "https://soumyasrishtyproperties.com",
        "http://localhost:5173",
        "https://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Vercel Serverless Export
export default app;