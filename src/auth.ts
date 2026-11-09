// This file validates Keycloak bearer tokens and attaches the application user to the request.

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { NextFunction, Request, Response } from "express";
import type { User } from "./types.js";
import { createUser, findUserByEmail, findUserByKeycloakSubject } from "./store.js";
import { HttpError } from "./errors.js";

const keycloakIssuer = process.env.KEYCLOAK_ISSUER_URL;
const keycloakAudience = process.env.KEYCLOAK_AUDIENCE;
const keycloakJwks = keycloakIssuer
  ? createRemoteJWKSet(new URL(`${keycloakIssuer}/protocol/openid-connect/certs`))
  : undefined;

export function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const header = request.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized", "A valid bearer token is required."));
  }

  if (!keycloakJwks || !keycloakIssuer) {
    throw new Error("KEYCLOAK_ISSUER_URL must be configured.");
  }
  return requireKeycloakAuth(header.slice(7), request, next);
}

async function requireKeycloakAuth(
  token: string,
  request: Request,
  next: NextFunction,
) {
  try {
    const verification = keycloakAudience
      ? await jwtVerify(token, keycloakJwks!, {
          issuer: keycloakIssuer,
          audience: keycloakAudience,
        })
      : await jwtVerify(token, keycloakJwks!, { issuer: keycloakIssuer });
    const user = findOrCreateUserFromKeycloakClaims(verification.payload);
    request.user = user;
    return next();
  } catch (error) {
    console.error("Keycloak token validation failed:", error);
    return next(new HttpError(401, "Unauthorized", "A valid bearer token is required."));
  }
}

function findOrCreateUserFromKeycloakClaims(claims: JWTPayload): User {
  if (typeof claims.sub !== "string") {
    throw new Error("Keycloak token has no subject");
  }

  const email = typeof claims.email === "string"
    ? claims.email
    : typeof claims.preferred_username === "string"
      ? claims.preferred_username
      : undefined;
  if (!email) {
    throw new Error("Keycloak token has no email or preferred username");
  }

  const roles = keycloakRoles(claims);
  const role = roles.includes("admin") ? "admin" : "user";
  const user = findUserByKeycloakSubject(claims.sub) ?? findUserByEmail(email) ?? createUser(
    email,
    role,
    claims.sub,
  );
  user.keycloakSubject = claims.sub;
  user.role = role;
  return user;
}

function keycloakRoles(claims: JWTPayload): string[] {
  const realmAccess = claims.realm_access;
  if (
    typeof realmAccess === "object" &&
    realmAccess !== null &&
    "roles" in realmAccess &&
    Array.isArray(realmAccess.roles)
  ) {
    return realmAccess.roles.filter((role): role is string => typeof role === "string");
  }
  return [];
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
