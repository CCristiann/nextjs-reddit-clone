import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null | undefined) {

    // Check if the input is a string
    if (typeof name !== 'string') {
      return null;
    }
  
    // Split the name into words
    const words = name.split(' ');
  
    // Extract the first letter of each word and concatenate them
    const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  
    return initials;
}

