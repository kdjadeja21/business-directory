export interface Business {
  id: string;
  name: string;
  brief: string;
  description: string;
  profilePhoto?: string | null;
  categories: string[];
  city: string;
  contacts: {
    phones: Array<{
      countryCode?: string;
      number: string;
      hasWhatsapp: boolean;
    }>;
    emails: string[];
  };
  createdAt: string;
  updatedAt: string;
  user_id: string;
  createdBy: string;
  updatedBy: string;
}

export interface BusinessFormData
  extends Omit<Business, "id" | "createdAt" | "updatedAt"> {}
