// src/utils/dataResolver.ts

/**
 * Resolves a dot-separated path within an object to retrieve a value.
 * @param obj The object to search within.
 * @param path The dot-separated path (e.g., 'employeeInfo.name').
 * @returns The value at the specified path, or undefined if not found.
 */
export const resolveDataPath = (obj: any, path: string): any => {
  if (!obj || typeof obj !== 'object' || !path) {
    return undefined;
  }
  return path.split('.').reduce((current, key) => {
    // Check if current is valid and key exists in current
    return current && typeof current === 'object' && key in current
      ? current[key]
      : undefined;
  }, obj);
};
