'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { passFail } = require('./common');

test('CircuitBreaker status - import stats', t => {
  t.plan(12);
  const breaker = new CircuitBreaker(passFail, { errorThresholdPercentage: 1 });
  const prevStats = {
    failures: 1,
    fallbacks: 1,
    successes: 1,
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  breaker.initialize({ stats: prevStats });
  const deepEqual = (t, expected) =>
    actual => t.deepEqual(actual, expected, 'expected status values');

  Promise.all([
    breaker.fire(10).then(deepEqual(t, 10)),
    breaker.fire(20).then(deepEqual(t, 20)),
    breaker.fire(30).then(deepEqual(t, 30))
  ])
    .then(() => t.deepEqual(breaker.status.stats.fires, 4,
      'breaker fired 4 times'))
    .catch(t.fail)
    .then(() => {
      breaker.fire(-10)
        .then(t.fail)
        .catch(value => {
          const stats = breaker.status.stats;
          t.equal(value, 'Error: -10 is < 0',
            'fails with correct error message');
          t.equal(stats.failures, 2, 'status reports a single failure');
          t.equal(stats.fires, 5, 'status reports 4 fires');
        })
        .then(() => {
          breaker.fallback(() => 'Fallback called');
          return breaker.fire(-20)
            .then(result => {
              const stats = breaker.status.stats;
              t.equal(result, 'Fallback called', 'fallback is invoked');
              t.equal(stats.failures, 2, 'status reports 1 failure');
              t.equal(stats.rejects, 2, 'status reports 1 reject');
              t.equal(stats.fires, 6, 'status reports 5 fires');
              t.equal(stats.fallbacks, 2, 'status reports 1 fallback');
            })
            .catch(t.fail);
        })
        .then(_ => breaker.shutdown())
        .catch(t.fail)
        .then(t.end);
    });
});

test('CircuitBreaker status - import stats, but leave some out', t => {
  t.plan(3);
  const breaker = new CircuitBreaker(passFail, { errorThresholdPercentage: 1 });
  const prevStats = {
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  breaker.initialize({ stats: prevStats });
  t.equal(breaker.status.stats.failures, 0, 'failures was initialized');
  t.equal(breaker.status.stats.fallbacks, 0, 'fallbacks was initialized');
  t.equal(breaker.status.stats.successes, 0, 'successes was initialized');

  breaker.shutdown();
  t.end();
});
