export interface Business {
  id: string;
  name: string;
  brief: string;
  description: string;
  profilePhoto?: string | null;
  categories: string[];
  city: string;
  contacts: {
    phones: string[];
    emails: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface BusinessFormData
  extends Omit<Business, "id" | "createdAt" | "updatedAt"> {}
