"use client";

import { useEffect, useState } from "react";
import { Business } from "@/types/business";
import { SearchBar } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { Pagination } from "@/components/Pagination";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { businessService } from "@/lib/services/businessService";
import { Loader } from "@/components/Loader";

const ITEMS_PER_PAGE = 5;

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
    businesses: filteredBusinesses,
    totalResults,
    selectedTags,
    setSelectedTags,
    availableCategories,
    selectedCity,
    setSelectedCity,
    availableCities,
  } = useBusinessSearch(businesses);

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <Loader />;
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

      <BusinessGrid businesses={paginatedBusinesses} />

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
