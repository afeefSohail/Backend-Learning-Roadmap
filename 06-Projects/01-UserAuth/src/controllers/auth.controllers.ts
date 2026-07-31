import { Request , Response } from "express";
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the
// internal connection engine has been removed — you must pass an adapter, with no fallback.
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg" ;
import { PrismaClient, Prisma } from "@prisma/client";

// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"], // Enables query logging
});

const accountCreated = (req: Request, res: Response) => {
    res.json({ success: true, message: "Account Created" });
}

const login = (req: Request, res: Response) => {
    res.json({ success: true, message: "Verify credentials, issue JWT" });
}

const logout = (req: Request, res: Response) => {
  res.json({ success: true, message: "Clear session/token (client-side mostly, or blacklist later)" });
}

const getMe = (req: Request, res: Response) => {
    res.json({ success: true, message: `Return currently authenticated user (quick "am I logged in" check)` });
}

export {
    accountCreated,
    login,
    logout,
    getMe
}