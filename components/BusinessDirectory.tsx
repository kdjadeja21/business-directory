"use client";

import { useEffect, useState, useRef } from "react";
import { Business } from "@/types/business";
import { SearchBar } from "@/components/SearchBar";
import { BusinessGrid } from "@/components/BusinessGrid";
import { Pagination } from "@/components/Pagination";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { businessService } from "@/lib/services/businessService";
import { Loader } from "@/components/Loader";
import { ItemsPerPage } from "@/components/ItemsPerPage";

const paginationStyles = {
  wrapper: "flex flex-col gap-8",
  paginationWrapper: "flex items-center justify-center w-full mt-8 mb-4",
  controlsWrapper: "flex flex-col sm:flex-row items-center gap-4 sm:gap-6",
};

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

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
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
  } = useBusinessSearch(businesses);

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    scrollToTop();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="container mx-auto px-4 py-8" ref={mainRef}>
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

      <div className={paginationStyles.wrapper}>
        <BusinessGrid businesses={filteredBusinesses} />

        <div className={paginationStyles.paginationWrapper}>
          <div className={paginationStyles.controlsWrapper}>
            <ItemsPerPage
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[5, 10, 15, 20]}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
