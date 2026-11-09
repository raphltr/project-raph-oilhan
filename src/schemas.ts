//Validate the entrance data for the API endpoints using Zod schemas. This file defines the validation rules for user registration, login, user updates, and alternative creation and updates.

import { z } from "zod";

const email = z.string().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).max(128);

export const registerSchema = z.object({ email, password }).strict();
export const loginSchema = registerSchema;
export const userUpdateSchema = z
  .object({ email, password, role: z.enum(["user", "admin"]) })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one property is required");

export const alternativeCreateSchema = z
  .object({
    taskId: z.number().int().positive(),
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(5000),
  })
  .strict();

export const alternativeUpdateSchema = z
  .object({
    taskId: z.number().int().positive(),
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1).max(5000),
    status: z.enum(["pending", "approved", "rejected"]),
    moderationReason: z.string().trim().max(1000).nullable(),
  })
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one property is required");

export const idSchema = z.coerce.number().int().positive();
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
export type AlternativeCreateDto = z.infer<typeof alternativeCreateSchema>;
export type AlternativeUpdateDto = z.infer<typeof alternativeUpdateSchema>;
