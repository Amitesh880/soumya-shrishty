let prisma;

try {
    const { PrismaClient } = await import("@prisma/client");
    
    console.log("Initializing Prisma client...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

    prisma = new PrismaClient({
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
} catch (error) {
    console.error("❌ Failed to import Prisma client:", error.message);
    console.log("⚠️ Using fallback data mode");
    
    // Create a mock prisma client for fallback
    prisma = {
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        residency: {
            findMany: () => Promise.resolve([]),
            count: () => Promise.resolve(0),
            create: () => Promise.resolve({}),
            createMany: () => Promise.resolve({ count: 0 }),
            deleteMany: () => Promise.resolve({ count: 0 })
        },
        user: {
            findUnique: () => Promise.resolve(null),
            create: () => Promise.resolve({}),
            update: () => Promise.resolve({}),
            findMany: () => Promise.resolve([])
        }
    };
}

export {prisma}