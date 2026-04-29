export type UserRole = "admin" | "client";

export interface Business {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  ownerId: string;
  ownerName?: string;
  ownerPhone?: string;
  plan?: "free" | "premium" | "pro";
  expiresAt?: string; // Data ISO
  services: Service[];
  imageUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface Staff {
  id: string;
  businessId: string;
  name: string;
  role: string;
  avatar?: string;
  availableDays: number[]; // 0-6
}

export interface Appointment {
  id?: string;
  userId: string;
  businessId: string;
  staffId: string;
  serviceId: string;
  date: any; // Firestore Timestamp
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: any;
}
