import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();
const app = express();

// --- CORS Configuration ---
// Setting explicit allowed origins and credentials to resolve CORS issues
const allowedOrigins = [
    "https://real-estate-project-ed7qs1kjr-amitesh880s-projects.vercel.app", 
    "http://localhost:3000"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Routes
app.use("/api/User", userRoute);
app.use("/api/residency", residencyRoute);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

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

// --- VERCEL EXPORT FIX ---
// This is the CRITICAL change: export the app instead of using app.listen()
export default app;
