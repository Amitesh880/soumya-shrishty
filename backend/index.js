import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { authRoute } from "./routes/authRoute.js";
import { contactRoute } from "./routes/contactRoute.js";
import { prisma } from "./config/prismaConfig.js";

dotenv.config();
const app = express();

// Define CORS options using the allowed origins you specified
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
app.use("/api/contact", contactRoute);

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Health endpoints
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

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

        await prisma.residency.deleteMany();
        const result = await prisma.residency.createMany({ data: transformedData });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
