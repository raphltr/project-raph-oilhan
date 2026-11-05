// Centralised validation middleware for the application, providing functions to parse and validate request data, check user authentication and authorization, and handle validation errors in a consistent manner.

import { z, ZodError } from "zod";
import type { Request } from "express";
import { HttpError } from "../errors.js";

export function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      for (const issue of error.issues) {
        const key = issue.path.join(".") || "body";
        (errors[key] ??= []).push(issue.message);
      }
      throw new HttpError(400, "Validation Error", "The request contains invalid values.", errors);
    }
    throw error;
  }
}

export function currentUser(request: Request) {
  if (!request.user) throw new HttpError(401, "Unauthorized", "Authentication is required.");
  return request.user;
}

export function requireAdmin(request: Request) {
  const user = currentUser(request);
  if (user.role !== "admin") {
    throw new HttpError(403, "Forbidden", "Administrator role is required.");
  }
  return user;
}
