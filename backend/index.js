import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
app.use(cors(corsOptions));

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Simple test endpoint
app.get("/api/test", (req, res) => {
    res.status(200).json({ 
        message: "Backend is working - CORS Fixed!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
    res.status(200).json({ 
        message: "CORS is working",
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });
});

// Test POST endpoint for CORS
app.post("/api/cors-test", (req, res) => {
    res.status(200).json({ 
        message: "CORS POST is working",
        origin: req.headers.origin,
        body: req.body,
        timestamp: new Date().toISOString()
    });
});

// Mock residency endpoint
app.get("/api/residency/allresd", (req, res) => {
    res.status(200).json([
        {
            id: "mock-1",
            title: "Mock Property 1",
            description: "This is a mock property for testing",
            price: 100000,
            address: "123 Mock Street",
            city: "Mock City",
            country: "Mock Country",
            image: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            facilities: { bedrooms: 2, bathrooms: 2, parkings: 1 }
        }
    ]);
});

// Mock user endpoints
app.post("/api/user/allFav/", (req, res) => {
    res.status(200).json({ favResidenciesID: [] });
});

app.post("/api/user/allBookings/", (req, res) => {
    res.status(200).json({ bookedVisits: [] });
});

app.post("/api/user/register", (req, res) => {
    res.status(201).json({
        success: true,
        message: "User registered successfully (mock)",
        user: { id: "mock-user", email: req.body.email }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Simple server is running on port ${PORT}`);
});

export default app;
