import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { authRoute } from "./routes/authRoute.js";
import { prisma } from "./config/prismaConfig.js";

dotenv.config();
const app = express();
// PORT definition is unnecessary in a serverless export environment

// Define CORS options using the allowed origins you specified
const corsOptions = {
    origin: ["https://real-estate-project-henna-seven.vercel.app","http://soumyasrishtyproperties.com","https://soumyasrishtyproperties.com", "http://localhost:5173/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","Cookie"],
};

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Simple test endpoint for listing
app.get("/api/test", (req, res) => {
    res.status(200).json({ 
        message: "Backend is working",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Test residency endpoint
app.get("/api/residency/test", async (req, res) => {
    try {
        await prisma.$connect();
        const count = await prisma.residency.count();
        res.status(200).json({
            message: "Residency endpoint is working",
            residency_count: count,
            database_connected: true,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            message: "Residency endpoint error",
            error: error.message,
            database_connected: false,
            timestamp: new Date().toISOString()
        });
    }
});

// Database health check
app.get("/api/health/db", async (req, res) => {
    try {
        await prisma.$connect();
        const residencyCount = await prisma.residency.count();
        res.status(200).json({ 
            status: "ok", 
            database: "connected",
            database_url: process.env.DATABASE_URL ? "Set in environment" : "Not set in environment",
            residency_count: residencyCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error", 
            database: "disconnected",
            database_url: process.env.DATABASE_URL ? "Set in environment" : "Not set in environment",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 5000; // Use a default port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel Serverless Export (Replaces app.listen)
export default app;
