
/**
 * Calculate similarity between two embeddings using cosine similarity
 */
export const calculateSimilarity = (embedding1: number[], embedding2: number[]): number => {
  // Implement cosine similarity
  if (!embedding1.length || !embedding2.length || embedding1.length !== embedding2.length) {
    return 0;
  }

  const dotProduct = embedding1.reduce((sum, val, i) => sum + val * (embedding2[i] || 0), 0);
  const norm1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

  return norm1 && norm2 ? dotProduct / (norm1 * norm2) : 0;
};

/**
 * Safe API call wrapper with error handling
 */
export async function makeAPICall<T>(callback: () => Promise<T>): Promise<T | null> {
  try {
    const result = await callback();
    return result || null;
  } catch (error) {
    console.error(`API call error:`, error);
    return null;
  }
}
