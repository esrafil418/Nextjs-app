import "dotenv/config"; // Loads your .env file
import { defineConfig } from "prisma/config";

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL ?? "", // Get URL from .env file
	},
});
