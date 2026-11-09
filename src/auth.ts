// This file is responsible for handling authentication-related functionality, including issuing JWT tokens and requiring authentication for protected routes.

import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { User } from "./types.js";
import { findUser } from "./store.js";
import { HttpError } from "./errors.js";

const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret";

export function issueToken(user: User): string {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(
    { sub: user.id, role: user.role },
    jwtSecret,
    expiresIn
      ? { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
      : { expiresIn: "1h" },
  );
}

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const header = request.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized", "A valid bearer token is required."));
  }

  try {
    const payload = jwt.verify(header.slice(7), jwtSecret);
    if (typeof payload !== "object" || typeof payload.sub !== "number") {
      throw new Error("Invalid token payload");
    }
    const user = findUser(payload.sub);
    if (!user) {
      throw new Error("User no longer exists");
    }
    request.user = user;
    return next();
  } catch {
    return next(new HttpError(401, "Unauthorized", "A valid bearer token is required."));
  }
}

export function optionalAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Public requests may see approved alternatives; a token is needed for private pending ones.
  if (!request.header("authorization")) {
    return next();
  }

  return requireAuth(request, response, next);
}
