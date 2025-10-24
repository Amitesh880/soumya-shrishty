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

async function fixUserCreatedAtIfNeeded() {
    try {
        // Convert string-typed createdAt to BSON Date
        const convertCreatedAtStrings = await prisma.$runCommandRaw({
            update: 'User',
            updates: [
                {
                    q: { createdAt: { $type: 'string' } },
                    u: [
                        { $set: { createdAt: { $toDate: "$createdAt" }, updatedAt: new Date() } },
                    ],
                    multi: true,
                    upsert: false,
                },
            ],
        });
        console.log("User.createdAt string→Date fix:", JSON.stringify(convertCreatedAtStrings));

        // Backfill missing or null createdAt
        const backfillCreatedAtMissing = await prisma.$runCommandRaw({
            update: 'User',
            updates: [
                {
                    q: { $or: [ { createdAt: { $exists: false } }, { createdAt: null } ] },
                    u: { $set: { createdAt: new Date(), updatedAt: new Date() } },
                    multi: true,
                    upsert: false,
                },
            ],
        });
        console.log("User.createdAt null/missing backfill:", JSON.stringify(backfillCreatedAtMissing));

        // Convert string-typed updatedAt to BSON Date
        const convertUpdatedAtStrings = await prisma.$runCommandRaw({
            update: 'User',
            updates: [
                {
                    q: { updatedAt: { $type: 'string' } },
                    u: [
                        { $set: { updatedAt: { $toDate: "$updatedAt" } } },
                    ],
                    multi: true,
                    upsert: false,
                },
            ],
        });
        console.log("User.updatedAt string→Date fix:", JSON.stringify(convertUpdatedAtStrings));

        // Backfill missing or null updatedAt
        const backfillUpdatedAtMissing = await prisma.$runCommandRaw({
            update: 'User',
            updates: [
                {
                    q: { $or: [ { updatedAt: { $exists: false } }, { updatedAt: null } ] },
                    u: { $set: { updatedAt: new Date() } },
                    multi: true,
                    upsert: false,
                },
            ],
        });
        console.log("User.updatedAt null/missing backfill:", JSON.stringify(backfillUpdatedAtMissing));
    } catch (e) {
        console.warn("User.createdAt/updatedAt fix skipped:", e.message);
    }
}

// Test database connection only if DATABASE_URL is available
if (process.env.DATABASE_URL) {
    prisma.$connect()
        .then(async () => {
            console.log("✅ Database connected successfully");
            await fixUserCreatedAtIfNeeded();
        })
        .catch((error) => {
            console.error("❌ Database connection failed:", error.message);
        });
} else {
    console.log("⚠️ DATABASE_URL not set, using fallback data");
}

export {prisma}