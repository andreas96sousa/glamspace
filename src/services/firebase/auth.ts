import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const authService = {
  async loginAdmin(email: string, pass: string) {
    if (!auth) throw new Error("Auth not initialized");
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  async login(email: string, pass: string) {
    if (!auth) throw new Error("Auth not initialized");
    return await signInWithEmailAndPassword(auth, email, pass);
  },

  async registerAdmin(email: string, pass: string) {
    if (!auth) throw new Error("Auth not initialized");
    return await createUserWithEmailAndPassword(auth, email, pass);
  },

  async logout() {
    if (!auth) return;
    await firebaseSignOut(auth);
  }
};
