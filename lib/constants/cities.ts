export const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "San Francisco",
  "Charlotte",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Boston",
  // Add more cities as needed
] as const;

// Type for city names
export type CityName = (typeof CITIES)[number];

// Helper functions
export const cityUtils = {
  // Get all cities
  getAll: () => CITIES,

  // Check if a city is valid
  isValid: (city: string): city is CityName => {
    return CITIES.includes(city as CityName);
  },

  // Sort cities alphabetically
  getSorted: () => [...CITIES].sort(),

  // Search cities
  search: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return CITIES.filter((city) => city.toLowerCase().includes(lowercaseQuery));
  },
};
