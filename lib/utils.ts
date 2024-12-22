import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function truncateText(text: string, charLimit: number): string {
  if (text.length > charLimit) {
    return text.slice(0, charLimit) + "...";
  }
  return text;
}
