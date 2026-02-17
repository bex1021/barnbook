export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface Amenities {
  indoorArena: boolean;
  outdoorArena: boolean;
  trails: boolean;
  roundPen: boolean;
  hotWalker: boolean;
  washRack: boolean;
}

export interface Boarding {
  types: string[];
  stallCount: number;
  turnout: "individual" | "group" | "both";
}

export interface Pricing {
  boardingFrom: number;
  lessonsFrom: number;
  currency: string;
}

export interface Trainer {
  name: string;
  bio: string;
  specialties: string[];
}

export interface Barn {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  address: Address;
  phone: string;
  website: string;
  email: string;
  disciplines: string[];
  amenities: Amenities;
  boarding: Boarding;
  pricing: Pricing;
  trainers: Trainer[];
  lessonAvailability: boolean;
  horseBreeds: string[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "owner" | "user";
  createdAt: string;
}

export interface Review {
  id: string;
  barnId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
}
