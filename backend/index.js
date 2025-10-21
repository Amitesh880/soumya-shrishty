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

// Environment variables debug endpoint
app.get("/api/debug/env", (req, res) => {
    const envVars = {
        DATABASE_URL: process.env.DATABASE_URL ? "Set (first 20 chars: " + process.env.DATABASE_URL.substring(0, 20) + "...)" : "Not set",
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: process.env.PORT || "not set",
        allEnvKeys: Object.keys(process.env).filter(key => 
            key.includes('DATABASE') || 
            key.includes('MONGO') || 
            key.includes('DB') ||
            key.includes('URL')
        )
    };
    
    res.status(200).json({
        message: "Environment variables debug",
        environment: envVars,
        timestamp: new Date().toISOString()
    });
});

// Database seeding endpoint (for development only)
app.post("/api/seed-database", async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: "Database seeding is not allowed in production"
            });
        }

        const residencyData = await import("../data/Residency.json", { assert: { type: "json" } });
        
        // Transform and insert data
        const transformedData = residencyData.default.map(item => ({
            title: item.title,
            description: item.description,
            price: item.price,
            address: item.address,
            city: item.city,
            country: item.country,
            image: item.image,
            facilities: item.facilities || { bedrooms: 2, bathrooms: 2, parkings: 1 }
        }));

        // Clear existing data
        await prisma.residency.deleteMany();
        
        // Insert new data
        const result = await prisma.residency.createMany({
            data: transformedData
        });

        res.status(200).json({
            success: true,
            message: "Database seeded successfully",
            insertedCount: result.count,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error seeding database:", error);
        res.status(500).json({
            success: false,
            message: "Failed to seed database",
            error: error.message
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
