import { supabase } from "./supabase";
import { Barn, User, Review } from "./types";

function mapBarn(row: Record<string, unknown>): Barn {
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    address: row.address as Barn["address"],
    phone: (row.phone as string) || "",
    website: (row.website as string) || "",
    email: (row.email as string) || "",
    disciplines: (row.disciplines as string[]) || [],
    amenities: row.amenities as Barn["amenities"],
    boarding: row.boarding as Barn["boarding"],
    pricing: row.pricing as Barn["pricing"],
    trainers: (row.trainers as Barn["trainers"]) || [],
    lessonAvailability: row.lesson_availability as boolean,
    horseBreeds: (row.horse_breeds as string[]) || [],
    photos: (row.photos as string[]) || [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    role: row.role as User["role"],
    createdAt: row.created_at as string,
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    barnId: row.barn_id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    rating: row.rating as number,
    text: row.text as string,
    createdAt: row.created_at as string,
  };
}

// Barns
export async function getBarns(): Promise<Barn[]> {
  const { data, error } = await supabase.from("barns").select("*");
  if (error) throw error;
  return (data || []).map(mapBarn);
}

export async function getBarnBySlug(slug: string): Promise<Barn | undefined> {
  const { data } = await supabase
    .from("barns")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ? mapBarn(data) : undefined;
}

export async function getBarnById(id: string): Promise<Barn | undefined> {
  const { data } = await supabase
    .from("barns")
    .select("*")
    .eq("id", id)
    .single();
  return data ? mapBarn(data) : undefined;
}

export async function getBarnsByOwner(ownerId: string): Promise<Barn[]> {
  const { data, error } = await supabase
    .from("barns")
    .select("*")
    .eq("owner_id", ownerId);
  if (error) throw error;
  return (data || []).map(mapBarn);
}

export async function createBarn(
  barn: Omit<Barn, "id" | "createdAt" | "updatedAt">
): Promise<Barn> {
  const { data, error } = await supabase
    .from("barns")
    .insert({
      owner_id: barn.ownerId,
      name: barn.name,
      slug: barn.slug,
      description: barn.description,
      address: barn.address,
      phone: barn.phone,
      website: barn.website,
      email: barn.email,
      disciplines: barn.disciplines,
      amenities: barn.amenities,
      boarding: barn.boarding,
      pricing: barn.pricing,
      trainers: barn.trainers,
      lesson_availability: barn.lessonAvailability,
      horse_breeds: barn.horseBreeds,
      photos: barn.photos,
    })
    .select()
    .single();
  if (error) throw error;
  return mapBarn(data);
}

export async function updateBarn(
  id: string,
  updates: Partial<Barn>
): Promise<Barn | null> {
  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.website !== undefined) dbUpdates.website = updates.website;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.disciplines !== undefined) dbUpdates.disciplines = updates.disciplines;
  if (updates.amenities !== undefined) dbUpdates.amenities = updates.amenities;
  if (updates.boarding !== undefined) dbUpdates.boarding = updates.boarding;
  if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
  if (updates.trainers !== undefined) dbUpdates.trainers = updates.trainers;
  if (updates.lessonAvailability !== undefined) dbUpdates.lesson_availability = updates.lessonAvailability;
  if (updates.horseBreeds !== undefined) dbUpdates.horse_breeds = updates.horseBreeds;
  if (updates.photos !== undefined) dbUpdates.photos = updates.photos;

  const { data } = await supabase
    .from("barns")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  return data ? mapBarn(data) : null;
}

export async function deleteBarn(id: string): Promise<boolean> {
  const { error } = await supabase.from("barns").delete().eq("id", id);
  return !error;
}

// Users
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return data ? mapUser(data) : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  return data ? mapUser(data) : undefined;
}

export async function createUser(
  user: Omit<User, "id" | "createdAt">
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      password_hash: user.passwordHash,
      role: user.role,
    })
    .select()
    .single();
  if (error) throw error;
  return mapUser(data);
}

// Reviews
export async function getReviewsByBarn(barnId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("barn_id", barnId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReview);
}

export async function createReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      barn_id: review.barnId,
      user_id: review.userId,
      user_name: review.userName,
      rating: review.rating,
      text: review.text,
    })
    .select()
    .single();
  if (error) throw error;
  return mapReview(data);
}

export async function getAverageRating(barnId: string): Promise<number> {
  const reviews = await getReviewsByBarn(barnId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export async function getStats(): Promise<{ barnCount: number; cityCount: number; stateCount: number }> {
  const { data } = await supabase.from("barns").select("address");
  const barns = data || [];
  const cities = new Set(barns.map((b: Record<string, unknown>) => (b.address as { city?: string })?.city).filter(Boolean));
  const states = new Set(barns.map((b: Record<string, unknown>) => (b.address as { state?: string })?.state).filter(Boolean));
  return { barnCount: barns.length, cityCount: cities.size, stateCount: states.size };
}

export async function getBarnsBySlugs(slugs: string[]): Promise<Barn[]> {
  const { data } = await supabase.from("barns").select("*").in("slug", slugs);
  return (data || []).map(mapBarn);
}
