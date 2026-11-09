// This file contains the type definitions for the application avoiding types duplication and providing a single source of truth for the data structures used throughout the codebase.

export type UserRole = "user" | "admin";
export type AlternativeStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  keycloakSubject?: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Task {
  id: number;
  name: string;
}

export interface SoftwareAlternative {
  id: number;
  submittedBy: number;
  taskId: number;
  name: string;
  description: string;
  status: AlternativeStatus;
  moderationReason: string | null;
  createdAt: string;
}

export interface PublicUser {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
