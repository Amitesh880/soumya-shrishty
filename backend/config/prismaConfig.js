import { PrismaClient } from "@prisma/client";

console.log("Initializing Prisma client...");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
prisma.$connect()
    .then(() => {
        console.log("✅ Database connected successfully");
        console.log("Database URL:", process.env.DATABASE_URL ? "Set in environment" : "Not set in environment");
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        console.error("Please check your DATABASE_URL environment variable");
        console.error("Error details:", error.message);
    });

export {prisma}