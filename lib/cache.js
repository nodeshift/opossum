/**
 * Simple in-memory cache implementation
 * @class MemoryCache
 * @property {Map} cache Cache map
 */
class MemoryCache {
  constructor (maxEntries) {
    this.cache = new Map();
    this.maxEntries = maxEntries ?? 2 ** 24 - 1; // Max size for Map is 2^24.
  }

  /**
   * Get cache value by key
   * @param {string} key Cache key
   * @return {any} Response from cache
   */
  get (key) {
    const cached = this.cache.get(key);
    if (cached) {
      if (cached.expiresAt > Date.now() || cached.expiresAt === 0) {
        return cached.value;
      }
      this.cache.delete(key);
    }
    return undefined;
  }

  /**
   * Set cache key with value and ttl
   * @param {string} key Cache key
   * @param {any} value Value to cache
   * @param {number} ttl Time to live in milliseconds
   * @return {void}
   */
  set (key, value, ttl) {
    // Evict first entry when at capacity - only when it's a new key.
    if (this.cache.size === this.maxEntries && this.get(key) === undefined) {
      this.cache.delete(this.cache.keys().next().value);
    }

    this.cache.set(key, {
      expiresAt: ttl,
      value
    });
  }

  /**
   * Delete cache key
   * @param {string} key Cache key
   * @return {void}
   */
  delete (key) {
    this.cache.delete(key);
  }

  /**
   * Clear cache
   * @returns {void}
   */
  flush () {
    this.cache.clear();
  }
}

module.exports = exports = MemoryCache;
