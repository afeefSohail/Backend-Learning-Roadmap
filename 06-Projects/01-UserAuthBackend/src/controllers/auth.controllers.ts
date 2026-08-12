import { Request, Response } from "express";
import { AuthedRequest } from "#middlewares/auth.middleware";
import { sendResponse } from "#utils/response.util";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_TTL_MS,
} from "#utils/jwt.util";

import { SignUpInput, LoginInput } from "#validators/auth.validators";

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

//                         Request<Params, ResBody, ReqBody, ReqQuery>
const signUp = async (req: Request<{}, {}, SignUpInput>, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    sendResponse({
      res,
      code: 200,
      message: "Account created successfully",
      data: safeUser,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return sendResponse({
        res,
        code: 409,
        message: "Email already in use."
      });
    }
    console.error(error);
    sendResponse({ res, code: 500, message: "Something went wrong."});
  }
};

const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { photos : true}
    });

    if (!user) {
      return sendResponse({
        res,
        code: 401,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return sendResponse({
        res,
        code: 401,
        message: "Invalid email or password"
      });
    }

    const accessToken = signAccessToken({ userId: user.id }); // valid 15 min, used on every request
    const refreshToken = signRefreshToken({ userId: user.id }); // valid 7 days, used only to get new access tokens

    // Question: When JWT verify by refersh token byself then why we need to save refresh token in db ?
    // Answer: revocability. jwt.verify() can only tell you "this token was legitimately signed by us and hasn't expired yet."
    // It cannot tell you "...but we've decided to cancel it early." JWTs are stateless by design
    // — once signed, the server has no built-in way to say "actually, ignore this one" before its natural expiry,
    // unless it keeps a record somewhere to check against.

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    sendResponse({
      res,
      code: 200,
      message: "Login successful",
      data: { user: safeUser, accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error logging in."
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse({
        res,
        code: 400,
        message: "Refresh token is required"
      });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.expiresAt < new Date()) {
      // Clean up expired row if it still exists
      if (stored) {
        await prisma.refreshToken.delete({
          where: { id: stored.id },
        });
      }

      return sendResponse({
        res,
        code: 401,
        message: "Invalid or expired refresh token"
      });
    }

    // Verifies signature + throws if tampered/expired at the JWT level too
    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = signAccessToken({ userId: payload.userId });

    sendResponse({
      res,
      code: 200,
      message: "Access token generated successfully!",
      data: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 401,
      message: "Invalid or expired refresh token"
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendResponse({
        res,
        code: 400,
        message: "Refresh token is required"
      });
    }

    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    // deleteMany (not delete) so a retry/duplicate logout call doesn't throw
    // if the token was already removed
    sendResponse({
      res,
      code: 200,
      message: "Logged out successfully!"
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error logging out."
    });
  }
};

const getMe = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { photos : true}
    });

    if (!user) {
      return sendResponse({
        res,
        code: 404,
        message: "User not found"
      });
    }

    const { passwordHash: _, ...safeUser } = user;
    sendResponse({
      res,
      code: 200,
      message: "User found successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      res,
      code: 500,
      message: "Error fetching user."
    });
  }
};

export { signUp, login, refresh, logout, getMe };
