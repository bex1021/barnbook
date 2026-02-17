import fs from "fs";
import path from "path";
import { Barn, User, Review } from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJSON<T>(filename: string): T[] {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T[]): void {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Barns
export function getBarns(): Barn[] {
  return readJSON<Barn>("barns.json");
}

export function getBarnBySlug(slug: string): Barn | undefined {
  return getBarns().find((b) => b.slug === slug);
}

export function getBarnById(id: string): Barn | undefined {
  return getBarns().find((b) => b.id === id);
}

export function getBarnsByOwner(ownerId: string): Barn[] {
  return getBarns().filter((b) => b.ownerId === ownerId);
}

export function createBarn(barn: Barn): Barn {
  const barns = getBarns();
  barns.push(barn);
  writeJSON("barns.json", barns);
  return barn;
}

export function updateBarn(id: string, updates: Partial<Barn>): Barn | null {
  const barns = getBarns();
  const index = barns.findIndex((b) => b.id === id);
  if (index === -1) return null;
  barns[index] = { ...barns[index], ...updates, updatedAt: new Date().toISOString() };
  writeJSON("barns.json", barns);
  return barns[index];
}

export function deleteBarn(id: string): boolean {
  const barns = getBarns();
  const filtered = barns.filter((b) => b.id !== id);
  if (filtered.length === barns.length) return false;
  writeJSON("barns.json", filtered);
  return true;
}

// Users
export function getUsers(): User[] {
  return readJSON<User>("users.json");
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function createUser(user: User): User {
  const users = getUsers();
  users.push(user);
  writeJSON("users.json", users);
  return user;
}

// Reviews
export function getReviews(): Review[] {
  return readJSON<Review>("reviews.json");
}

export function getReviewsByBarn(barnId: string): Review[] {
  return getReviews().filter((r) => r.barnId === barnId);
}

export function createReview(review: Review): Review {
  const reviews = getReviews();
  reviews.push(review);
  writeJSON("reviews.json", reviews);
  return review;
}

export function getAverageRating(barnId: string): number {
  const reviews = getReviewsByBarn(barnId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
