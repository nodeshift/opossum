'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const common = require('./common');
const passFail = common.passFail;
const expected = 34;

test('Using cache', t => {
  t.plan(9);

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

test('Using cache max size', t => {
  t.plan(2);

  const options = {
    cache: true,
    cacheSize: 2
  };
  const breaker = new CircuitBreaker(passFail, options);

  Promise.all([
    breaker.fire(1),
    breaker.fire(2),
    breaker.fire(3),
    breaker.fire(4)
  ]).then(() => {
    const stats = breaker.status.stats;
    t.equals(stats.cacheHits, 0, 'does not hit the cache');
    t.equals(breaker.options.cacheTransport.cache.size, options.cacheSize, 'respects max size');
  }).then(t.end)
    .catch(t.fail);
});

test('Using cache with TTL', t => {
  t.plan(12);

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

test('Using coalesce cache + regular cache.', t => {
  t.plan(10);

  const options = {
    cache: true,
    cacheTTL: 200,
    coalesce: true,
    coalesceTTL: 200
  };

  const breaker = new CircuitBreaker(passFail, options);

  // fire breaker three times in rapid succession, expect execution once.
  Promise.all([
    breaker.fire(expected),
    breaker.fire(expected),
    breaker.fire(expected)
  ]).then(results => {
    const stats = breaker.status.stats;
    t.equals(stats.cacheHits, 0, 'does not hit the cache');
    t.equals(stats.coalesceCacheHits, 2, 'hits coalesce cache twice');
    t.equals(stats.fires, 3, 'fired thrice');
    t.equals(stats.successes, 1, 'success once');
    t.equals(results.length, 3, 'executed 3');
    t.deepEqual(results, [expected, expected, expected],
      `cache coalesceCacheHits:coalesceCacheMisses` +
      `${stats.coalesceCacheHits}:${stats.coalesceCacheMisses}`);
  })
    // Re-fire breaker, expect cache hit as cache takes preference.
    .then(() => new Promise(resolve => setTimeout(resolve, 0)))
    .then(() => breaker.fire(expected)).then(arg => {
      const stats = breaker.status.stats;

      t.equals(stats.cacheHits, 1, 'hits the cache');
      t.equals(stats.coalesceCacheHits, 2, 'not further hits to coalesce cache, it is now expired');
      t.equals(stats.successes, 1, 'success once');
      t.equals(arg, expected,
        `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(t.end)
    .catch(t.fail);
});

test('No coalesce cache.', t => {
  t.plan(5);
  const breaker = new CircuitBreaker(passFail);

  // fire breaker three times, expect execution three times.
  Promise.all([
    breaker.fire(expected),
    breaker.fire(expected),
    breaker.fire(expected)
  ]).then(results => {
    const stats = breaker.status.stats;
    t.equals(stats.cacheHits, 0, 'does not hit the cache');
    t.equals(stats.coalesceCacheHits, 0, 'does not hit coalesce cache');
    t.equals(stats.fires, 3, 'fired thrice');
    t.equals(stats.successes, 3, 'success thrice');
    t.deepEqual(results, [expected, expected, expected],
      `cache coalesceCacheHits:coalesceCacheMisses` +
      `${stats.coalesceCacheHits}:${stats.coalesceCacheMisses}`);
  })
    .then(t.end)
    .catch(t.fail);
});

test('Using cache with custom get cache key', t => {
  t.plan(11);

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
      t.equals(breaker.options.cacheTransport.cache.size, 1, 'cache have one entry');
      t.ok(breaker.options.cacheTransport.cache.has(`key-${expected}`), 'cache has the key');

      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
      breaker.clearCache();
    })
    .then(() => breaker.clearCache())
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
  t.plan(15);

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

  t.equals(cache.size, 0, 'cache is empty');

  breaker.fire(expected)
    .then(arg => {
      t.equals(cache.size, 1, 'cache has one entry');
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      t.equals(cache.size, 1, 'cache has one entry');
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 1, 'hit the cache');
      t.equals(stats.cacheMisses, 1, 'did not emit miss');
      t.equals(stats.fires, 2, 'fired twice');
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
      breaker.clearCache();
      t.equals(cache.size, 0, 'cache is empty');
    })
    .then(() => breaker.fire(expected))
    .then(arg => {
      t.equals(cache.size, 1, 'cache has one entry');
      const stats = breaker.status.stats;
      t.equals(arg, expected,
          `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(() => breaker.shutdown())
    .then(() => {
      t.equals(cache.size, 0, 'cache is empty');
    })
    .then(t.end)
    .catch(t.fail);
});
