
// This file is only here to provide a simple in-memory store for the application before implementing the real database.

// Be careful when modifying the entities : they are linked (by their id) with the test in api-tests/bruno

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
    // adminId = 1
    const admin = await createUser("admin@example.com", "AdminPassword123!", "admin");
    // userId = 2
    const user = await createUser("user@example.com", "UserPassword123!");
    // otherUserId = 3
    const otherUser = await createUser("other-user@example.com", "OtherUserPassword123!");
    const deleteUser = await createUser("await-user@example.com", "AwaitUserPassword123!");
    
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

    alternatives.push({
      id: nextAlternativeId++,
      submittedBy: user.id,
      taskId: 1,
      name: "Pending alternative",
      description: "An alternative owned by the user in pending mode : can be modified",
      status: "pending",
      moderationReason: null,
      createdAt: new Date().toISOString(),
    });

    alternatives.push({
      id: nextAlternativeId++,
      submittedBy: user.id,
      taskId: 2,
      name: "Deletable pending alternative",
      description: "A pending alternative reserved for deletion tests.",
      status: "pending",
      moderationReason: null,
      createdAt: new Date().toISOString(),
    });

    alternatives.push({
      id: nextAlternativeId++,
      submittedBy: otherUser.id,
      taskId: 2,
      name: "Other user Alternative ID",
      description: "A pending alternative reserved for deletion tests.",
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
