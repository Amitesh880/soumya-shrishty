import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
prisma.$connect()
    .then(() => {
        console.log("Database connected successfully to:", process.env.DATABASE_URL);
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        console.error("Please check your DATABASE_URL environment variable");
    });

export {prisma}