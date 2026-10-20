import fs from "fs/promises";
import path from "node:path";
import { Request, Response } from "express";
import { AuthedRequest } from "#middlewares/auth.middleware";
import { withFullPhotoUrl } from "#utils/url.util";
import { sendResponse } from "#utils/response.util";
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the
// internal connection engine has been removed — you must pass an adapter, with no fallback.
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
import { Pool } from "pg";
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
      return sendResponse({
        res,
        code: 400,
        message: "Invalid User ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        photos: {
          //select: { url: true },
          include: {},
        },
      },
    });

    if (!user) {
      return sendResponse({
        res,
        code: 404,
        message: "User not found",
      });
    }

    const userWithFullPhotoUrls = {
      ...user,
      photos: user.photos.map(withFullPhotoUrl),
    };

    sendResponse({
      res,
      code: 200,
      message: "User found Successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error fetching user.",
    });
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
        createdAt: true,
        photos: {
          //select: { url: true },
          include: {},
        },
      },
    });

    if (!user) {
      return sendResponse({
        res,
        code: 404,
        message: "User not found",
      });
    }

    const userWithFullPhotoUrls = {
      ...user,
      photos: user.photos.map(withFullPhotoUrl),
    };

    sendResponse({
      res,
      code: 200,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error updating user.",
    });
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
          //select: { url: true },
          include: {},
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

    sendResponse({
      res,
      code: 200,
      message: "User Deleted Successfully.",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return sendResponse({
        res,
        code: 404,
        message: "User not found.",
      });
    }
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error deleting user.",
    });
  }
};

export { getUser, updateUser, deleteUser };
