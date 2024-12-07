"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Business } from "@/types/business";
import { SearchBar } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { Pagination } from "@/components/Pagination";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { BusinessCardSkeleton } from "@/components/BusinessCardSkeleton";
import { businessService } from "@/lib/services/businessService";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <BusinessCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await businessService.getAll();
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    businesses: filteredBusinesses,
    totalResults,
    selectedTags,
    setSelectedTags,
    availableCategories,
    selectedCity,
    setSelectedCity,
    availableCities,
  } = useBusinessSearch(businesses);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Business Directory</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          availableCategories={availableCategories}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          availableCities={availableCities}
        />
        <p className="text-muted-foreground mt-2">
          Found {totalResults} business{totalResults !== 1 ? "es" : ""}
        </p>
      </div>

      <BusinessGrid businesses={filteredBusinesses} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
