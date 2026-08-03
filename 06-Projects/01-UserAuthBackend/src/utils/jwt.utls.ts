import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface AccessTokenPayload {
  userId: number;
}

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN } as jwt.SignOptions);

export const signRefreshToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string) => 
  jwt.verify(token, REFRESH_SECRET) as AccessTokenPayload;

// 7d in ms, used to compute expiresAt for the DB row
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;