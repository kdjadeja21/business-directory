import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  DocumentData,
  QuerySnapshot,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Business } from "@/types/business";
import { revalidatePath } from 'next/cache';

const COLLECTION_NAME = "businesses";

export const businessService = {
  // Create a new business
  async create(business: Partial<Business>): Promise<string> {
    try {
      const businessData = {
        ...business,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        businessData
      );
      return docRef.id;
    } catch (error) {
      console.error("Error creating business:", error);
      throw error;
    }
  },

  // Get all businesses
  async getAll(): Promise<Business[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Business[];
    } catch (error) {
      console.error("Error getting businesses:", error);
      throw error;
    }
  },

  // Get a single business by ID
  async getById(id: string): Promise<Business | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Business;
      }
      return null;
    } catch (error) {
      console.error("Error getting business:", error);
      throw error;
    }
  },

  // Update a business
  async update(id: string, data: Partial<Business>): Promise<void> {
    try {
      // Remove id from data to avoid overwriting document ID
      const { id: _, ...updateData } = data;

      // Get current document data
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Document does not exist");
      }

      // Only update if data has changed
      const currentData = docSnap.data();
      const hasChanges = Object.entries(updateData).some(([key, value]) => {
        return JSON.stringify(currentData[key]) !== JSON.stringify(value);
      });

      if (hasChanges) {
        await updateDoc(docRef, {
          ...updateData,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating business:", error);
      throw error;
    }
  },

  // Delete a business
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting business:", error);
      throw error;
    }
  },

  // Get businesses by city
  async getByCity(city: string): Promise<Business[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("city", "==", city)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Business[];
    } catch (error) {
      console.error("Error getting businesses by city:", error);
      throw error;
    }
  },

  // Get businesses by category
  async getByCategory(category: string): Promise<Business[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("categories", "array-contains", category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Business[];
    } catch (error) {
      console.error("Error getting businesses by category:", error);
      throw error;
    }
  },

  // Get recent businesses
  async getRecent(limit: number = 5): Promise<Business[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc"),
        limitQuery(limit)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Business[];
    } catch (error) {
      console.error("Error getting recent businesses:", error);
      throw error;
    }
  },
};
