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
    origin: ["https://real-estate-project-henna-seven.vercel.app", "http://localhost:5173/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","Cookie"],
};

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));

// Routes
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

const PORT = process.env.PORT || 5000; // Use a default port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Vercel Serverless Export (Replaces app.listen)
export default app;
