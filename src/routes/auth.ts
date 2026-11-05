import { Router } from "express";
import bcrypt from "bcryptjs";
import { issueToken } from "../auth.js";
import { HttpError } from "../errors.js";
import { loginSchema, registerSchema } from "../schemas.js";
import { createUser, findUserByEmail, publicUser } from "../store.js";
import { parse } from "../middleware/validation.js";

export const authRouter = Router();

authRouter.post("/register", async (request, response) => {
  const dto = parse(registerSchema, request.body);
  if (findUserByEmail(dto.email)) {
    throw new HttpError(409, "Conflict", "Email is already registered.");
  }
  const user = await createUser(dto.email, dto.password);
  response.location(`/api/users/${user.id}`).status(201).json(publicUser(user));
});

authRouter.post("/login", async (request, response) => {
  const dto = parse(loginSchema, request.body);
  const user = findUserByEmail(dto.email);
  if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
    throw new HttpError(401, "Unauthorized", "Email or password is invalid.");
  }
  response.json({ token: issueToken(user), user: publicUser(user) });
});
