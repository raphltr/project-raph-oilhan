// This file is the entry point of the application. It sets up the Express server, configures middleware, and defines routes for handling requests.

import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { HttpError, problemDetails } from "./errors.js";
import { seedStore } from "./store.js";
import { usersRouter } from "./routes/users.js";
import { alternativesRouter } from "./routes/alternatives.js";

if (!process.env.KEYCLOAK_ISSUER_URL) {
  throw new Error("KEYCLOAK_ISSUER_URL must be configured.");
}

await seedStore(); // Peuple la base de données avec un utilisateur admin et un utilisateur normal, ainsi qu'une alternative logicielle pour le test.

export const app = express();
app.use(cors({ origin: true })); // A modifier lorsque l'on aura un frontend pour ne pas autoriser toutes les origines
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_request, response) => response.status(200).json({ status: "ok" }));
app.use("/api/users", usersRouter);
app.use("/api/software-alternatives", alternativesRouter);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (!(error instanceof HttpError)) console.error(error);
  const details = problemDetails(error);
  response.status(details.status).type("application/problem+json").json(details);
});
