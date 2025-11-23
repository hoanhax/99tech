// Application constants

// Pagination constants
export const DEFAULT_TAKE = 10;
export const MAX_TAKE = 100;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Database
export const DB_CONNECTION_TIMEOUT = 5000; // 5 seconds

// String length constants (for validation)
export const STRING_LENGTH = {
  // Minimum length
  MIN: 1,

  // Very short fields (codes, slugs, usernames)
  TINY: 20,

  // Short fields (names, titles, labels)
  SHORT: 50,

  // Medium fields (addresses, short descriptions)
  MEDIUM: 100,

  // Long fields (descriptions, summaries)
  LONG: 500,

  // Extra long fields (detailed descriptions, content)
  EXTRA_LONG: 2000,

  // Very long fields (articles, rich text content)
  VERY_LONG: 10000,
} as const;
