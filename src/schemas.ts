// Validate request data for user updates and software-alternative operations.

import { z } from "zod";

const email = z.string().email().max(254).transform((value) => value.toLowerCase());
export const userUpdateSchema = z
  .object({ email, role: z.enum(["user", "admin"]) })
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

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
export type AlternativeCreateDto = z.infer<typeof alternativeCreateSchema>;
export type AlternativeUpdateDto = z.infer<typeof alternativeUpdateSchema>;
