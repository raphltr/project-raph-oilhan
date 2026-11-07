
// This file is only here to provide a simple in-memory store for the application before implementing the real database.

import bcrypt from "bcryptjs";
import type { AlternativeStatus, SoftwareAlternative, Task, User, UserRole } from "./types.js";

export const users: User[] = [];
export const tasks: Task[] = [
  { id: 1, name: "Text editing" },
  { id: 2, name: "Web browsing" },
];
export const alternatives: SoftwareAlternative[] = [];

let nextUserId = 1;
let nextAlternativeId = 1;

export async function createUser(email: string, password: string, role: UserRole = "user") {
  const user: User = {
    id: nextUserId++,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function publicUser(user: User) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function seedStore() {
  if (users.length === 0) {
    const admin = await createUser("admin@example.com", "AdminPassword123!", "admin");
    const user = await createUser("user@example.com", "UserPassword123!");
    alternatives.push({
      id: nextAlternativeId++,
      submittedBy: user.id,
      taskId: 1,
      name: "LibreOffice Writer",
      description: "A free word processor for older devices.",
      status: "approved",
      moderationReason: null,
      createdAt: new Date().toISOString(),
    });
    void admin;
  }
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}

export function findUser(id: number) {
  return users.find((user) => user.id === id);
}

export function findAlternative(id: number) {
  return alternatives.find((alternative) => alternative.id === id);
}

export function allocateAlternativeId() {
  return nextAlternativeId++;
}

export function isValidTask(id: number) {
  return tasks.some((task) => task.id === id);
}

export function updateAlternativeStatus(
  alternative: SoftwareAlternative,
  status: AlternativeStatus,
): void {
  alternative.status = status;
}
