import fs from "node:fs/promises";
import path from "node:path";
import { Response } from "express";
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

const uploadPhotos = async (req: AuthedRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return sendResponse({
        res,
        code: 400,
        message: "No files uploaded",
      });
    }

    const photos = await prisma.photo.createManyAndReturn({
      data: files.map((file) => ({
        url: `/uploads/${file.filename}`,
        userId: req.userId as number,
      })),
    });

    const photosWithFullUrl = photos.map(withFullPhotoUrl);

    sendResponse({
      res,
      code: 201,
      message: "Photos uploaded successfully",
      data: photos,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error uploading photos.",
    });
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

    sendResponse({
      res,
      code: 200,
      message: "Photos retrieved successfully",
      data: photos,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error fetching photos.",
    });
  }
};

const getPhoto = async (
  req: AuthedRequest<{ photoId: string }>,
  res: Response,
) => {
  try {
    const photoId = parseInt(req.params.photoId, 10);

    if (isNaN(photoId)) {
      return sendResponse({
        res,
        code: 400,
        message: "Invalid Photo ID",
      });
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== req.userId) {
      return sendResponse({
        res,
        code: 404,
        message: "Photo not found",
      });
    }

    const photosWithFullUrl = withFullPhotoUrl(photo);

    sendResponse({
      res,
      code: 200,
      message: "Photo retrieved successfully",
      data: photo,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error fetching photo.",
    });
  }
};

const deletePhoto = async (
  req: AuthedRequest<{ photoId: string }>,
  res: Response,
) => {
  try {
    const photoId = parseInt(req.params.photoId, 10);

    if (isNaN(photoId)) {
      return sendResponse({
        res,
        code: 400,
        message: "Invalid Photo ID",
      });
    }

    const deletedPhoto = await prisma.photo.delete({
      where: {
        id: photoId,
        AND: { userId: req.userId },
      },
    });

    await fs
      .unlink(
        path.join(process.cwd(), "uploads", path.basename(deletedPhoto.url)),
      )
      .catch(() => {});

    sendResponse({
      res,
      code: 200,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return sendResponse({
        res,
        code: 404,
        message: "Photo not found",
      });
    }
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error Deleting photo.",
    });
  }
};

export { uploadPhotos, getAllPhotos, getPhoto, deletePhoto };
