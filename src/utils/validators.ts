import { z } from 'zod';

// Schema for city name validation
const cityNameSchema = z.string({
  required_error: 'City name is required',
  invalid_type_error: 'City name must be a string',
})
  .trim()
  .min(1, 'City name cannot be empty')
  .regex(
    /^[a-zA-ZÀ-ž\s\-'.]+$/,
    'City name can only contain letters, spaces, hyphens, apostrophes, and periods'
  )
  .refine(
    (val) => val.trim().length > 0,
    'City name cannot be only whitespace'
  );

// Schema for zip code validation
const zipCodeSchema = z.string({
  required_error: 'Zip code is required',
  invalid_type_error: 'Zip code must be a string',
})
  .trim()
  .refine(
    (val) => val.length === 5,
    'Zip code must be exactly 5 digits'
  )
  .refine(
    (val) => /^\d+$/.test(val),
    'Zip code must contain only numbers'
  )
  .refine(
    (val) => val.trim().length > 0,
    'Zip code cannot be empty or whitespace'
  );

// Schema for coordinates validation
const coordinatesSchema = z.string({
  required_error: 'Coordinates are required',
  invalid_type_error: 'Coordinates must be a string',
})
  .trim()
  .refine(
    (val) => val.trim().length > 0,
    'Coordinates cannot be empty or whitespace'
  )
  .transform((str): { lat: number; lon: number } => {
    const parts = str.split(',').map(part => part.trim());
    if (parts.length !== 2) {
      throw new Error('Coordinates must be in the format "lat,lon"');
    }
    
    const latStr = parts[0];
    const lonStr = parts[1];
    
    const lat = Number(latStr);
    const lon = Number(lonStr);
    
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Both latitude and longitude must be valid numbers');
    }
    
    if (lat < -90 || lat > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    
    if (lon < -180 || lon > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }
    
    return { lat, lon };
  });

// Combined location schema
export const locationSchema = z.union([
  cityNameSchema,
  zipCodeSchema,
  coordinatesSchema,
]);

/**
 * Validates if a string is a valid location (city name, zip code, or coordinates)
 * @param location - The location string to validate
 * @returns boolean - True if the location is valid
 */
export const isValidLocation = (location: unknown): boolean => {
  if (typeof location !== 'string') return false;
  
  // Check if the location matches any of the schemas
  const result = locationSchema.safeParse(location);
  return result.success;
};

/**
 * Validates a location string and returns detailed validation result
 * @param location - The location string to validate
 * @returns A validation result object with success status and error message if invalid
 */
export const validateLocation = (location: unknown): { success: boolean; error?: string } => {
  if (typeof location !== 'string') {
    return { success: false, error: 'Location must be a string' };
  }
  
  const result = locationSchema.safeParse(location);
  
  if (!result.success) {
    // Format the error message to be more user-friendly
    const error = result.error.issues
      .map(issue => issue.message)
      .join('; ');
    
    return { success: false, error };
  }
  
  return { success: true };
};
