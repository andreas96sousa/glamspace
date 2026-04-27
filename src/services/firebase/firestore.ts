import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Business, Appointment, Staff } from "@/types";

export const businessService = {
  async getBySlug(slug: string): Promise<Business | null> {
    if (!db) return null;
    const q = query(collection(db, "businesses"), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...data } as Business;
  },

  async getById(id: string): Promise<Business | null> {
    if (!db) return null;
    const docRef = doc(db, "businesses", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Business;
  }
};

export const staffService = {
  async getByBusiness(businessId: string): Promise<Staff[]> {
    if (!db) return [];
    const q = query(collection(db, "staff"), where("businessId", "==", businessId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
  }
};

export const appointmentService = {
  async create(appointment: Omit<Appointment, "id" | "createdAt">) {
    if (!db) throw new Error("Database not initialized");
    return await addDoc(collection(db, "appointments"), {
      ...appointment,
      createdAt: serverTimestamp()
    });
  },

  async getByBusinessDate(businessId: string, date: Date): Promise<Appointment[]> {
    if (!db) return [];
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "appointments"),
      where("businessId", "==", businessId),
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<=", Timestamp.fromDate(endOfDay))
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
  },

  async updateStatus(id: string, status: Appointment["status"]) {
    if (!db) return;
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, { status });
  }
};
