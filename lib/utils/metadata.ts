import { Metadata } from "next";
import { Business } from "@/types/business";

export function generateBusinessMetadata(business: Business | null): Metadata {
  if (!business) {
    return {
      title: "Business Directory",
      description: "A directory of local businesses",
    };
  }

  return {
    title: `${business.name} | Business Directory`,
    description: business.brief,
    openGraph: {
      title: business.name,
      description: business.brief,
      images: business.profilePhoto ? [business.profilePhoto] : [],
    },
    twitter: {
      card: "summary_large_image", 
      title: business.name,
      description: business.brief,
      images: business.profilePhoto ? [business.profilePhoto] : [],
    },
  };
}