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

export function generateWhatsAppLink(
  countryCode: string,
  phoneNumber: string
): string {
  // Ensure that the country code doesn't have any non-numeric characters or leading '+'
  const formattedCountryCode = countryCode.startsWith("+")
    ? countryCode.slice(1)
    : countryCode;

  // Combine the country code and phone number to create the full phone number
  const fullPhoneNumber = formattedCountryCode + phoneNumber;

  // Return the WhatsApp link
  return `https://wa.me/${fullPhoneNumber}`;
}
