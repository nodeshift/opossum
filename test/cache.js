'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const common = require('./common');

const passFail = common.passFail;

test('Using cache', t => {
  t.plan(9);
  const expected = 34;
  const options = {
    cache: true
  };
  const breaker = new CircuitBreaker(passFail, options);

  breaker.fire(expected)
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
      breaker.clearCache();
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.shutdown())
    .then(t.end)
    .catch(t.fail);
});

test('Using cache with TTL', t => {
  t.plan(12);
  const expected = 34;
  const options = {
    cache: true,
    cacheTTL: 100
  };
  const breaker = new CircuitBreaker(passFail, options);

  return breaker.fire(expected)
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    // wait 100ms for the cache to expire
    .then(() => new Promise(resolve => setTimeout(resolve, 100)))
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 2, 'did not emit miss');
      t.equals(stats.fires, 3, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(t.end)
    .catch(t.fail);
});

test('Using cache with custom get cache key', t => {
  t.plan(9);
  const expected = 34;
  const options = {
    cache: true,
    cacheGetKey: x => `key-${x}`
  };
  const breaker = new CircuitBreaker(passFail, options);

  breaker.fire(expected)
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
      breaker.clearCache();
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.shutdown())
    .then(t.end)
    .catch(t.fail);
});

test('Using cache with custom transport', t => {
  t.plan(9);
  const expected = 34;
  const cache = new Map();
  const options = {
    cache: true,
    cacheTransport: {
      get: key => cache.get(key),
      set: (key, value) => cache.set(key, value),
      flush: () => cache.clear()
    }
  };
  const breaker = new CircuitBreaker(passFail, options);

  breaker.fire(expected)
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
      breaker.clearCache();
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      const stats = breaker.status.stats;
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.shutdown())
    .then(t.end)
    .catch(t.fail);
});
