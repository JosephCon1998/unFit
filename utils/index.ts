import { formatDistanceToNow } from "date-fns";

export function darkenHexColor(hex: string, shades = 6) {
  // Ensure the hex color is valid and remove the '#' if present
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  // Convert hex to RGB
  let r: string | number = parseInt(hex.slice(0, 2), 16);
  let g: string | number = parseInt(hex.slice(2, 4), 16);
  let b: string | number = parseInt(hex.slice(4, 6), 16);

  // Define the darkening factor
  // Example: 0.8 represents 20% darkening per shade
  const factor = 0.8;

  // Apply the darkening factor for each shade
  for (let i = 0; i < shades; i++) {
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
  }

  // Convert each component back to a two-character hex string
  r = r.toString(16).padStart(2, "0");
  g = g.toString(16).padStart(2, "0");
  b = b.toString(16).padStart(2, "0");

  // Concatenate the components and return the new hex value
  return `#${r}${g}${b}`;
}

export function lightenHexColor(hex: string, shades = 2) {
  // Ensure the hex color is valid and remove the '#' if present
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }

  // Convert hex to RGB
  let r: string | number = parseInt(hex.slice(0, 2), 16);
  let g: string | number = parseInt(hex.slice(2, 4), 16);
  let b: string | number = parseInt(hex.slice(4, 6), 16);

  // Define the lightening factor
  // Example: 1.2 represents 20% lightening per shade
  const factor = 1.2;

  // Apply the lightening factor for each shade
  for (let i = 0; i < shades; i++) {
    r = Math.floor(Math.min(255, r * factor));
    g = Math.floor(Math.min(255, g * factor));
    b = Math.floor(Math.min(255, b * factor));
  }

  // Convert each component back to a two-character hex string
  r = r.toString(16).padStart(2, "0");
  g = g.toString(16).padStart(2, "0");
  b = b.toString(16).padStart(2, "0");

  // Concatenate the components and return the new hex value
  return `#${r}${g}${b}`;
}

export function formatDateToNow(date: string) {
  // Convert the input date if it's a string to a Date object
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Use formatDistanceToNow from date-fns to get the relative time difference
  const result = formatDistanceToNow(dateObj, { addSuffix: true });

  return result;
}

export function formatNumberWithCommas(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, milliseconds);
  });
}
