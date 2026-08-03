import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "#utils/jwt.utls";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    next();
  };

export interface AuthedRequest<P = {}> extends Request<P> {
  userId?: number;
}

export const requireJWTAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Why the Bearer scheme exists anyway — it's part of an actual HTTP standard, not a JWT-specific convention:
  // Authorization: Basic dXNlcjpwYXNz          (username:password, base64-encoded)
  // Authorization: Bearer eyJhbGciOi...         (a token — JWT, OAuth2 access token, etc.)
  // Authorization: Digest username="...", ...   (challenge-response hashing scheme)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};