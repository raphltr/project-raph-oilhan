import { Router } from "express";
import bcrypt from "bcryptjs";
import { requireAuth } from "../auth.js";
import { HttpError } from "../errors.js";
import { idSchema, paginationSchema, userUpdateSchema } from "../schemas.js";
import { findUser, findUserByEmail, publicUser, users } from "../store.js";
import { currentUser, parse, requireAdmin } from "../middleware/validation.js";
import { paginate } from "../utils/pagination.js";

export const usersRouter = Router();
usersRouter.use(requireAuth);

usersRouter.get("/", (request, response) => {
  requireAdmin(request);
  const { page, pageSize } = parse(paginationSchema, request.query);
  response.json(paginate(users.map(publicUser), page, pageSize));
});

usersRouter.get("/:id", (request, response) => {
  const actor = currentUser(request);
  const id = parse(idSchema, request.params.id);
  const target = findUser(id);
  if (!target) throw new HttpError(404, "Not Found", "User was not found.");
  if (actor.role !== "admin" && actor.id !== id) {
    throw new HttpError(403, "Forbidden", "You can only access your own profile.");
  }
  response.json(publicUser(target));
});

usersRouter.patch("/:id", async (request, response) => {
  const actor = currentUser(request);
  const id = parse(idSchema, request.params.id);
  const target = findUser(id);
  if (!target) throw new HttpError(404, "Not Found", "User was not found.");
  const dto = parse(userUpdateSchema, request.body);
  if (actor.role !== "admin" && actor.id !== id) {
    throw new HttpError(403, "Forbidden", "You can only update your own profile.");
  }
  if (dto.role !== undefined && actor.role !== "admin") {
    throw new HttpError(403, "Forbidden", "Only administrators can change roles.");
  }
  if (dto.email && dto.email !== target.email && findUserByEmail(dto.email)) {
    throw new HttpError(409, "Conflict", "Email is already registered.");
  }
  if (dto.email) target.email = dto.email;
  if (dto.password) target.passwordHash = await bcrypt.hash(dto.password, 12);
  if (dto.role) target.role = dto.role;
  response.json(publicUser(target));
});

usersRouter.delete("/:id", (request, response) => {
  const actor = currentUser(request);
  const id = parse(idSchema, request.params.id);
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) throw new HttpError(404, "Not Found", "User was not found.");
  if (actor.role !== "admin" && actor.id !== id) {
    throw new HttpError(403, "Forbidden", "You can only delete your own account.");
  }
  users.splice(index, 1);
  response.status(204).send();
});
