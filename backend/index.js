import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://real-estate-project-5snbadw5p-amitesh880s-projects.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // CORS configured here

app.use("/api/User", userRoute);
app.use("/api/residency", residencyRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
