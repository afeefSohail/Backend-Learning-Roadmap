import fs from "fs/promises";
import path from "node:path";
import { Request, Response } from "express";
import { AuthedRequest } from "#middlewares/auth.middleware";
import { withFullPhotoUrl } from "#utils/url.util";
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the
// internal connection engine has been removed — you must pass an adapter, with no fallback.
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
import { Pool } from "../../node_modules/@types/pg/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
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

// Request<Params, ResBody, ReqBody, ReqQuery>
// we define Params is string not string []
const getUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photos: {
          select: { url: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWithFullPhotoUrls = {
      ...user,
      photos: user.photos.map(withFullPhotoUrl),
    };

    res.status(200).json({ success: true, data: { user: userWithFullPhotoUrls } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user.", meta: error });
  }
};

const updateUser = async (req: AuthedRequest, res: Response) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name: name },
      select: {
        id: true,
        name: true,
        email: true,
        photos: {
          select: { url: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    const userWithFullPhotoUrls = {
      ...user,
      photos: user.photos.map(withFullPhotoUrl),
    };

    res.status(200).json({ success: true, data: { user: userWithFullPhotoUrls } });
  } catch (error) {
    res.status(500).json({ message: "Error updating user.", meta: error });
  }
};

const deleteUser = async (req: AuthedRequest, res: Response) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        photos: {
          select: { url: true },
        },
      },
    });

    // Clean up the actual files on disk — Prisma's cascade only removed the DB rows
    await Promise.all(
      deletedUser.photos.map((photo) =>
        fs
          .unlink(path.join(process.cwd(), "uploads", path.basename(photo.url)))
          .catch(() => {
            // Ignore errors here — file might already be missing, shouldn't block the response
          }),
      ),
    );
    
    res
      .status(200)
      .json({
        success: true,
        message: "User Delete Successfully."
      });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(500).json({ message: "Error deleting user.", meta: error });
  }
};

export { getUser, updateUser, deleteUser };
