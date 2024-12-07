"use client";

import { Business } from "@/types/business";
import { BusinessCard } from "@/components/BusinessCard";

interface BusinessGridProps {
  businesses: Business[];
}

export function BusinessGrid({ businesses }: BusinessGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business, index) => (
        <BusinessCard key={business.id} business={business} index={index} />
      ))}
    </div>
  );
}
