"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Tags, X, Search, FilterX } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableCategories: string[];
}

export function SearchBar({
  value: searchQuery,
  onChange: setSearchQuery,
  selectedCity,
  setSelectedCity,
  availableCities,
  selectedTags,
  onTagsChange,
  availableCategories,
}: SearchBarProps) {
  const cityOptions = useMemo(() => [
    { value: "", label: "All Cities" },
    ...availableCities.map(city => ({
      value: city,
      label: city
    }))
  ], [availableCities]);

  const categoryOptions = useMemo(() => [
    { value: "", label: "All Categories" },
    ...availableCategories.map(category => ({
      value: category,
      label: category
    }))
  ], [availableCategories]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    onTagsChange([]);
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedTags.length > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 w-full sm:w-auto">
          <Combobox
            options={cityOptions}
            value={selectedCity}
            onValueChange={setSelectedCity}
            placeholder="Select City"
            searchPlaceholder="Search cities..."
            icon={<MapPin className="h-4 w-4" />}
            emptyText="No cities found."
          />

          <Combobox
            options={categoryOptions}
            value={selectedTags[0] || ""}
            onValueChange={(value) => onTagsChange(value ? [value] : [])}
            placeholder="Select Category"
            searchPlaceholder="Search categories..."
            icon={<Tags className="h-4 w-4" />}
            emptyText="No categories found."
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="h-10 flex-1 sm:h-10 sm:w-10 sm:p-0 sm:flex-initial text-muted-foreground hover:text-foreground sm:self-auto self-end"
              title="Clear all filters"
            >
              <FilterX className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-0 mr-2" />
              <span className="sm:hidden">Clear Filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
