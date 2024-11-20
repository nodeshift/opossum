'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const MemoryCache = require('../lib/cache');
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
      t.equals(stats.coalesceCacheHits, 2, 'not further hits to coalesce cache, normal cache takes preference');
      t.equals(stats.successes, 1, 'success once');
      t.equals(arg, expected,
        `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(t.end)
    .catch(t.fail);
});

test('Using coalesce cache only.', t => {
  t.plan(10);

  const options = {
    cache: false,
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
    .then(() => new Promise(resolve => setTimeout(resolve, 250)))
    .then(() => breaker.fire(expected)).then(arg => {
      const stats = breaker.status.stats;

      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.coalesceCacheHits, 2, 'not further hits to coalesce cache, it is now expired');
      t.equals(stats.successes, 2, 'success twice, no cache used');
      t.equals(arg, expected,
        `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .then(t.end)
    .catch(t.fail);
});

// Test coalesce coalesceResetOn.
(function () {
  const options = {
    coalesce: true,
    timeout: 200,
    coalesceResetOn: ['error', 'success', 'timeout', 'foobar'],
    errorThresholdPercentage: 99,
    allowWarmUp: true
  };

  test('coalesceResetOn: expect proper parsing of options', t => {
    t.plan(1);
    const breaker = new CircuitBreaker(passFail, options);
    t.same(breaker.options.coalesceResetOn, ['error', 'success', 'timeout']);
    t.end();
  });

  test('coalesceResetOn: expect no hit after success', t => {
    t.plan(1);
    const breaker = new CircuitBreaker(passFail, options);
    breaker
      .fire(1)
      .then(() => {
        breaker.fire(1).then(() => {
          const stats = breaker.status.stats;
          t.equals(stats.coalesceCacheHits, 0, 'no hits to coalesce cache, it is reset when action succeeded.');
          t.end();
        });
      });
  });

  test('coalesceResetOn: expect no hit after error', t => {
    t.plan(1);
    const breaker = new CircuitBreaker(passFail, options);
    breaker
      .fire(-1)
      .catch(() => {
        breaker.fire(1).then(() => {
          const stats = breaker.status.stats;
          t.equals(stats.coalesceCacheHits, 0, 'no hits to coalesce cache, it is reset when action failed.');
          t.end();
        });
      });
  });

  test('coalesceResetOn: expect no hit after timeout', t => {
    t.plan(1);
    const timedBreaker = new CircuitBreaker(common.timedFunction, options);
    timedBreaker.fire(1000).catch(() => {
      timedBreaker.fire(1).then(() => {
        const stats = timedBreaker.status.stats;
        t.equals(stats.coalesceCacheHits, 0, 'no hits to coalesce cache, it is reset when action timed out.');
        t.end();
      });
    });
  });
})();

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

// Testing cache internal features/
test('Default max size of cache.', t => {
  t.plan(1);
  const c = new MemoryCache();
  t.equal(c.maxEntries, 16777215, 'Max size of cache is limited to max size of Map to prevent mem leaks.');
  t.end();
});

test('Enforcement of cache max size.', t => {
  t.plan(26);

  const maxEntries = 10;
  const c = new MemoryCache(maxEntries);
  t.equal(c.maxEntries, maxEntries, 'Max size is given and respected.');

  // note: 1 based index to match size.
  for (let i = 1; i <= maxEntries; i++) {
    const key = `key${i}`;
    c.set(key, i, 0);
    t.equal(c.cache.size, i, `${i} entry/ies added, so size is ${i}.`);
    t.equal(c.get(key), i, `${key} stored successfully`);
  }

  // next entry should purge oldest, as maxEntries is hit.
  c.set('new entry', 'someval');
  t.equal(
    c.cache.size,
    maxEntries,
    `Max size is respected, cache size does not grow over ${maxEntries}.`
  );
  t.equal(c.get('key1'), undefined, 'Oldest key (key1) is removed');

  // update oldest entry.
  c.set('key2', 'updated');
  c.set('another new entry', 'someval');
  t.equal(
    c.cache.size,
    maxEntries,
    `Max size is respected, cache size does not grow over ${maxEntries}.`
  );

  // And notice Map iterator behavior.
  t.equal(c.get('key2'), undefined, 'key2 is purged, as it was oldest. Updates do not count in Maps.');
  t.equal(c.get('key3'), 3, 'key3 can be considered older, but is not purged.');

  t.end();
});

test('Flush cache.', t => {
  t.plan(22);

  const maxEntries = 10;
  const c = new MemoryCache(maxEntries);

  // note: 1 based index to match size.
  for (let i = 1; i <= maxEntries; i++) {
    const key = `key${i}`;
    c.set(key, i, 0);
    t.equal(c.cache.size, i, `${i} entry/ies added, so size is ${i}.`);
    t.equal(c.get(key), i, `${key} stored successfully`);
  }

  c.flush();
  t.equal(c.cache.size, 0, 'cache flushed successfully');
  t.equal(c.get('key5'), undefined, 'all cache entries return undefined');

  t.end();
});

test('TTL is checked and entry removed when expired.', t => {
  t.plan(8);

  const c = new MemoryCache();
  const ok = 'cached string value';

  c.set('100ms ttl', ok, Date.now() + 100);
  c.set('200ms ttl', ok, Date.now() + 200);
  c.set('no ttl', ok, 0);

  t.equal(c.cache.size, 3, '3 items stored');
  t.deepEqual([c.get('100ms ttl'), c.get('200ms ttl'), c.get('no ttl')], [ok, ok, ok], '3 items can be retrieved');

  setTimeout(() => {
    t.equal(c.get('100ms ttl'), undefined, 'TTL expired, so cache returns undefined.');
    t.equal(c.cache.size, 2, 'Upon fetching expired item, it is removed from cache');
    t.deepEqual([c.get('200ms ttl'), c.get('no ttl')], [ok, ok], 'Entries that have not yet expired are ok');

    setTimeout(() => {
      t.equal(c.get('200ms ttl'), undefined, 'TTL expired, so cache returns undefined.');
      t.equal(c.cache.size, 1, 'Upon fetching expired item, it is removed from cache');
      t.equal(c.get('no ttl'), ok, 'Entries that have not yet expired are ok');

      t.end();
    }, 200);
  }, 101);
});
