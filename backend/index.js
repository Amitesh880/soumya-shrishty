import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();
const app = express();

const ALLOWED_ORIGINS = ["https://real-estate-project-henna-seven.vercel.app", "http://localhost:3000"];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return res.status(204).end();
    }

    next();
});


app.use(express.json());
app.use(cookieParser());


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

export default app;
