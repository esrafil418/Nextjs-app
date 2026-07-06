import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

export async function checkDatabaseConnection(): Promise<boolean> {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
