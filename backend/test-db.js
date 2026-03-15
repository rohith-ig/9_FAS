import prisma from "./config/database.js";

async function main() {
    console.log("Testing Prisma Connection...");
    try {
        const result = await prisma.$connect();
        console.log("Connected successfully!");
    } catch (e) {
        console.error("Prisma error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
