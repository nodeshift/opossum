/**
 * Simple in-memory cache implementation
 * @class MemoryCache
 * @property {Map} cache Cache map
 */
class MemoryCache {
  constructor () {
    this.cache = new Map();
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
    this.cache.set(key, {
      expiresAt: ttl,
      value
    });
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
