"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CITIES, cityUtils, CityName } from "@/lib/constants/cities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Tags, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Combine constant cities and dynamic cities, prioritizing available cities
  const allCities = useMemo(() => {
    const dynamicCities = Array.from(new Set(availableCities));
    // Remove duplicates by creating a Set from the combined array
    const uniqueCities = Array.from(
      new Set([...dynamicCities])
    );

    // Sort cities with available ones first, then alphabetically
    return uniqueCities.sort((a, b) => {
      const aAvailable = availableCities.includes(a);
      const bAvailable = availableCities.includes(b);
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      return a.localeCompare(b);
    });
  }, [availableCities]);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    const lowercaseQuery = citySearchQuery.toLowerCase();
    return allCities.filter((city) =>
      city.toLowerCase().includes(lowercaseQuery)
    );
  }, [allCities, citySearchQuery]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    const lowercaseQuery = categorySearchQuery.toLowerCase();
    return availableCategories.filter((category) =>
      category.toLowerCase().includes(lowercaseQuery)
    );
  }, [availableCategories, categorySearchQuery]);

  const handleCityChange = (value: string) => {
    setSelectedCity(value === "all" ? "" : value);
  };

  const isConstCity = (city: string): city is CityName => {
    return CITIES.includes(city as CityName);
  };

  const handleCategoryChange = (value: string) => {
    onTagsChange(value === "all" ? [] : [value]);
  };

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
        <Select value={selectedCity || "all"} onValueChange={handleCityChange}>
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder="Select City" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 relative">
              <Input
                type="text"
                placeholder="Search cities..."
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            <SelectItem value="all">All Cities</SelectItem>
            {filteredCities.map((city) => (
              <SelectItem
                key={city}
                value={city}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">{city}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedTags[0] || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <SelectValue placeholder="Select category..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 relative">
              <Input
                type="text"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            <SelectItem value="all">All Categories</SelectItem>
            {filteredCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
