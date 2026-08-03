import fs from "node:fs/promises";
import path from "node:path";
import { Response } from "express";
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

const uploadPhotos = async (req: AuthedRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const photos = await prisma.photo.createManyAndReturn({
      data: files.map((file) => ({
        url: `/uploads/${file.filename}`,
        userId: req.userId as number,
      })),
    });

    const photosWithFullUrl = photos.map(withFullPhotoUrl);
    res.status(201).json({ success: true, data: { photosWithFullUrl } });
  } catch (error) {
    res.status(500).json({ message: "Error uploading photos.", meta: error });
  }
};

const getAllPhotos = async (req: AuthedRequest, res: Response) => {
  try {
    // const photos = await prisma.user.findUnique({
    //   where: { id: req.userId },
    //   select: {
    //     photos: {
    //       orderBy: { createdAt: "desc" },
    //     },
    //   },
    // });

    // const photosWithFullUrl = photos?.photos.map(withFullPhotoUrl);

    // This version is better
    const photos = await prisma.photo.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const photosWithFullUrl = photos.map(withFullPhotoUrl);
    res.status(200).json({ success: true, data: { photosWithFullUrl } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching photos.", meta: error });
  }
};

const getPhoto = async (
  req: AuthedRequest<{ photoId: string }>,
  res: Response,
) => {
  try {
    const photoId = parseInt(req.params.photoId, 10);

    if (isNaN(photoId)) {
      return res.status(400).json({ error: "Invalid Photo ID" });
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== req.userId) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const photosWithFullUrl = withFullPhotoUrl(photo);
    res.status(200).json({ success: true, data: { photosWithFullUrl } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching photos.", meta: error });
  }
};

const deletePhoto = async (
  req: AuthedRequest<{ photoId: string }>,
  res: Response,
) => {
  try {
    const photoId = parseInt(req.params.photoId, 10);

    if (isNaN(photoId)) {
      return res.status(400).json({ error: "Invalid Photo ID" });
    }

    const deletedPhoto = await prisma.photo.delete({
      where: {
        id: photoId,
        AND: { userId: req.userId },
      },
    });

    await fs.unlink(path.join(process.cwd(), "uploads", path.basename(deletedPhoto.url))).catch(() => {});
    
    res
      .status(200)
      .json({ success: true, message: "Photo deleted successfully" })

  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(500).json({ message: "Error Deleting photo.", meta: error });
  }
};

export { uploadPhotos, getAllPhotos, getPhoto, deletePhoto };
