import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure dotenv is configured properly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Initializing Prisma client...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Test database connection only if DATABASE_URL is available
if (process.env.DATABASE_URL) {
    prisma.$connect()
        .then(() => {
            console.log("✅ Database connected successfully");
        })
        .catch((error) => {
            console.error("❌ Database connection failed:", error.message);
        });
} else {
    console.log("⚠️ DATABASE_URL not set, using fallback data");
}

export {prisma}