"use client";

import { useState, useMemo } from "react";
import { Business } from "@/types/business";
import { cityUtils, CITIES, CityName } from "@/lib/constants/cities";

export function useBusinessSearch(businesses: Business[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const availableCategories = useMemo(() => {
    const categories = new Set(businesses.flatMap((b) => b.categories || []));
    return Array.from(categories).sort();
  }, [businesses]);

  const availableCities = useMemo(() => {
    const cities = new Set(businesses.map((b) => b.city));
    return Array.from(cities).sort();
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      // Search in name
      const matchesName = business.name
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim());

      // Search in city
      const matchesCitySearch = business.city
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim());

      // Search in categories
      const matchesCategorySearch = business.categories?.some((category) =>
        category.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
      );

      // Combined search match
      const matchesSearch =
        matchesName || matchesCitySearch || matchesCategorySearch;

      // Filter by selected city
      const matchesCity = selectedCity ? business.city === selectedCity : true;

      // Filter by selected tags/categories
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => business.categories?.includes(tag));

      return matchesSearch && matchesCity && matchesTags;
    });
  }, [businesses, searchQuery, selectedCity, selectedTags]);

  // Calculate pagination
  const totalResults = filteredBusinesses.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Get current page of businesses
  const paginatedBusinesses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBusinesses, currentPage, itemsPerPage]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    businesses: paginatedBusinesses,
    totalResults,
    selectedTags,
    setSelectedTags,
    availableCategories,
    selectedCity,
    setSelectedCity,
    availableCities,
    itemsPerPage,
    setItemsPerPage,
  };
}
