import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth.js";
import { HttpError } from "../errors.js";
import {
  alternativeCreateSchema,
  alternativeUpdateSchema,
  idSchema,
  paginationSchema,
} from "../schemas.js";
import {
  allocateAlternativeId,
  alternatives,
  findAlternative,
  isValidTask,
} from "../store.js";
import { currentUser, parse } from "../middleware/validation.js";
import { paginate } from "../utils/pagination.js";

export const alternativesRouter = Router();

alternativesRouter.get("/", (request, response) => {
  const { page, pageSize } = parse(paginationSchema, request.query);
  const taskId = request.query.taskId === undefined
    ? undefined
    : parse(idSchema, request.query.taskId);
  const status = request.query.status === undefined
    ? undefined
    : parse(z.enum(["pending", "approved", "rejected"]), request.query.status);
  const user = request.user;
  const visible = alternatives.filter((alternative) => {
    const owns = alternative.submittedBy === user?.id;
    const canSee = user?.role === "admin"
      ? status === undefined || alternative.status === status
      : status === undefined
        ? alternative.status === "approved" || owns
        : alternative.status === status && (status === "approved" || owns);
    return canSee && (taskId === undefined || alternative.taskId === taskId);
  });
  response.json(paginate(visible, page, pageSize));
});

alternativesRouter.get("/:id", (request, response) => {
  const alternative = findAlternative(parse(idSchema, request.params.id));
  if (!alternative || alternative.status !== "approved") {
    throw new HttpError(404, "Not Found", "Software alternative was not found.");
  }
  response.json(alternative);
});

alternativesRouter.post("/", requireAuth, (request, response) => {
  const user = currentUser(request);
  const dto = parse(alternativeCreateSchema, request.body);
  if (!isValidTask(dto.taskId)) throw new HttpError(404, "Not Found", "Task was not found.");
  const alternative = {
    id: allocateAlternativeId(),
    submittedBy: user.id,
    ...dto,
    status: "pending" as const,
    moderationReason: null,
    createdAt: new Date().toISOString(),
  };
  alternatives.push(alternative);
  response.location(`/api/software-alternatives/${alternative.id}`).status(201).json(alternative);
});

alternativesRouter.patch("/:id", requireAuth, (request, response) => {
  const actor = currentUser(request);
  const alternative = findAlternative(parse(idSchema, request.params.id));
  if (!alternative) throw new HttpError(404, "Not Found", "Software alternative was not found.");
  const dto = parse(alternativeUpdateSchema, request.body);
  const ownsPending = alternative.submittedBy === actor.id && alternative.status === "pending";
  if (actor.role !== "admin" && !ownsPending) {
    throw new HttpError(403, "Forbidden", "Only the submitter of a pending alternative can update it.");
  }
  if (dto.taskId !== undefined && !isValidTask(dto.taskId)) {
    throw new HttpError(404, "Not Found", "Task was not found.");
  }
  if (actor.role !== "admin" && (dto.status !== undefined || dto.moderationReason !== undefined)) {
    throw new HttpError(403, "Forbidden", "Only administrators can moderate alternatives.");
  }
  Object.assign(alternative, dto);
  response.json(alternative);
});

alternativesRouter.delete("/:id", requireAuth, (request, response) => {
  const actor = currentUser(request);
  const alternative = findAlternative(parse(idSchema, request.params.id));
  if (!alternative) throw new HttpError(404, "Not Found", "Software alternative was not found.");
  if (actor.role !== "admin" && !(alternative.submittedBy === actor.id && alternative.status === "pending")) {
    throw new HttpError(403, "Forbidden", "Only the submitter of a pending alternative can delete it.");
  }
  alternatives.splice(alternatives.indexOf(alternative), 1);
  response.status(204).send();
});
