import uFuzzy from "@leeoniya/ufuzzy";

/**
 * Configured uFuzzy instance optimized for StudySpot search use cases
 * Uses SingleError mode for typo tolerance (1 typo per term allowed)
 */
const fuzzySearchEngine = new uFuzzy({
  // SingleError mode: tolerates single typos per term (perfect for student searches)
  intraMode: 1, // SingleError mode
  // Enable case-insensitive matching
  intraIns: 1,
  // Allow partial matching within words
  intraSub: 1,
  // Allow character transpositions (common typo)
  intraTrn: 1,
  // Allow single character deletions
  intraDel: 1,
});

/**
 * Search options interface for type safety
 */
export interface FuzzySearchOptions {
  /** Fields to search within each item */
  searchFields: string[];
  /** Minimum score threshold (0-1, lower = more permissive) */
  threshold?: number;
  /** Maximum number of results to return */
  limit?: number;
}

/**
 * Search result interface with relevance scoring
 */
export interface FuzzySearchResult<T> {
  item: T;
  score: number;
  matchedText: string;
}

/**
 * Generic fuzzy search function that works with any array of objects
 *
 * @param items - Array of items to search through
 * @param query - Search query string
 * @param options - Search configuration options
 * @returns Array of search results sorted by relevance
 */
export function fuzzySearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  options: FuzzySearchOptions,
): FuzzySearchResult<T>[] {
  if (!query.trim()) {
    return items.map((item) => ({
      item,
      score: 1,
      matchedText: "",
    }));
  }

  const { searchFields, threshold = 0.1, limit } = options;

  // Create searchable strings by combining specified fields
  const searchableTexts = items.map((item) => {
    return searchFields
      .map((field) => item[field] || "")
      .filter((text) => text.trim())
      .join(" ")
      .trim();
  });

  // Perform fuzzy search
  const indices = fuzzySearchEngine.filter(searchableTexts, query.trim());

  if (!indices || indices.length === 0) {
    return [];
  }

  // Get detailed match information
  const info = fuzzySearchEngine.info(indices, searchableTexts, query.trim());
  const order = fuzzySearchEngine.sort(info, searchableTexts, query.trim());

  // Build results with scores and matched text
  const results: FuzzySearchResult<T>[] = [];

  for (let i = 0; i < order.length; i++) {
    const idx = order[i];
    const originalIndex = indices[idx];
    const matchInfo = info && info[idx];

    // Calculate normalized score (higher is better)
    const score = matchInfo
      ? 1 - (matchInfo.score / searchableTexts[originalIndex].length)
      : 0.5;

    // Only include results above threshold
    if (score >= threshold) {
      results.push({
        item: items[originalIndex],
        score,
        matchedText: searchableTexts[originalIndex],
      });
    }
  }

  // Apply limit if specified
  return limit ? results.slice(0, limit) : results;
}

/**
 * Convenience function for simple text-based search
 * Useful when you just want to search a single field
 */
export function fuzzySearchSimple<T extends Record<string, any>>(
  items: T[],
  query: string,
  fieldName: string,
  threshold: number = 0.1,
): T[] {
  const results = fuzzySearch(items, query, {
    searchFields: [fieldName],
    threshold,
  });

  return results.map((result) => result.item);
}

/**
 * Multi-field search convenience function
 * Common pattern for searching across title + description fields
 */
export function fuzzySearchMultiField<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: string[],
  threshold: number = 0.1,
): T[] {
  const results = fuzzySearch(items, query, {
    searchFields: fields,
    threshold,
  });

  return results.map((result) => result.item);
}

export { fuzzySearchEngine };

