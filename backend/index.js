import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();
const app = express();

// Define CORS options using the allowed origins you specified
const corsOptions = {
    origin: ["https://real-estate-project-henna-seven.vercel.app", "http://localhost:3000"],
    withCredentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));


app.use((req, res, next) => {
  
    if (req.method === 'OPTIONS') {
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

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Vercel Serverless Export (Replaces app.listen)
export default app;
