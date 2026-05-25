import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Directly reading from process.env is the safest standard for Prisma 7 config files
    url: process.env.DATABASE_URL, 
  },
});