import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

const allowedOrigins = "*"; 

const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    allowedHeaders: "Content-Type,Authorization", 
    credentials: true, 
    optionsSuccessStatus: 204
};

app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use("/api/User", userRoute);
app.use("/api/residency", residencyRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
});
