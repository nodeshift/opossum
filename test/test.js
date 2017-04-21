'use strict';

const browser = require('./browser/browser-tap');
const test = require('tape');
const cb = require('../');

browser.enable();

test('global namespace', (t) => {
  const inBrowser = typeof window === 'object';
  const globalExport = typeof circuitBreaker !== 'undefined';
  t.ok((inBrowser && globalExport) ||
      (!inBrowser && !globalExport), 'behaves correctly');
  t.end();
});

test('api', (t) => {
  const breaker = cb(passFail);
  t.ok(breaker, 'CircuitBreaker');
  t.ok(cb.promisify, 'CircuitBreaker.promisify');
  t.ok(breaker.fire, 'CircuitBreaker.fire');
  t.notOk(breaker.opened, 'CircuitBreaker.opened');
  t.notOk(breaker.halfOpen, 'CircuitBreaker.halfOpen');
  t.ok(breaker.closed, 'CircuitBreaker.closed');
  t.ok(breaker.status, 'CircuitBreaker.status');
  t.ok(breaker.options, 'CircuitBreaker.options');
  t.ok(breaker.hystrixStats, 'CircuitBreaker.hystrixStats');
  t.equals(breaker.action, passFail, 'CircuitBreaker.action');
  t.end();
});

test('has a name based on the function name', (t) => {
  const breaker = cb(passFail);
  t.equals(breaker.name, passFail.name);
  t.end();
});

test('accepts a name as an option', (t) => {
  const breaker = cb(passFail, {name: 'tacoMachine'});
  t.equals(breaker.name, 'tacoMachine');
  t.end();
});

test('uses UUID as a name when none is provided and the function is anonymoys',
  (t) => {
    const breaker = cb((_) => _);
    t.ok(breaker.name);
    t.end();
  });

test('accepts a group as an option', (t) => {
  const breaker = cb(passFail, {group: 'tacoMachine'});
  t.equals(breaker.group, 'tacoMachine');
  t.end();
});

test('uses name as a group when no group is provided', (t) => {
  const breaker = cb(passFail, {name: 'tacoMachine'});
  t.equals(breaker.group, 'tacoMachine');
  t.end();
});

test('Passes parameters to the circuit function', (t) => {
  t.plan(1);
  const expected = 34;
  const breaker = cb(passFail);

  breaker.fire(expected)
    .then((arg) => t.equals(arg, expected, 'function parameters provided'))
    .then(t.end)
    .catch(t.fail);
});

test('Using cache', (t) => {
  t.plan(9);
  const expected = 34;
  const options = {
    cache: true
  };
  const breaker = cb(passFail, options);

  breaker.fire(expected)
    .then((arg) => {
      const stats = breaker.status.stats;
      t.equals(stats.cacheHits, 0, 'does not hit the cache');
      t.equals(stats.cacheMisses, 1, 'emits a cacheMiss');
      t.equals(stats.fires, 1, 'fired once');
      t.equals(arg, expected,
        `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
    })
    .catch(t.fail)
    .then(() => {
      breaker.fire(expected)
        .then((arg) => {
          const stats = breaker.status.stats;
          t.equals(stats.cacheHits, 1, 'hit the cache');
          t.equals(stats.cacheMisses, 1, 'did not emit miss');
          t.equals(stats.fires, 2, 'fired twice');
          t.equals(arg, expected, `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
          breaker.clearCache();
        })
        .catch(t.fail)
        .then(() => {
          breaker.fire(expected)
            .then((arg) => {
              const stats = breaker.status.stats;
              t.equals(arg, expected, `cache hits:misses ${stats.cacheHits}:${stats.cacheMisses}`);
            })
            .then(t.end)
            .catch(t.fail);
        });
    });
});

test('Fails when the circuit function fails', (t) => {
  t.plan(1);
  const breaker = cb(passFail);

  breaker.fire(-1)
    .then(() => {
      return t.fail;
    })
    .catch((e) => {
      t.equals(e, 'Error: -1 is < 0', 'expected error caught');
    })
    .then(t.end);
});

test('Fails when the circuit function times out', (t) => {
  t.plan(1);
  const expected = 'Timed out after 10ms';
  const breaker = cb(slowFunction, { timeout: 10 });

  breaker.fire()
    .then(t.fail)
    .catch((e) => t.equals(e.message, expected, 'timeout message received'))
    .then(t.end);
});

test('Works with functions that do not return a promise', (t) => {
  t.plan(1);
  const breaker = cb(nonPromise);

  breaker.fire()
    .then((arg) => t.equals(arg, 'foo', 'nonPromise function returns expected value'))
    .then(t.end)
    .catch(t.fail);
});

test('Works with non-functions', (t) => {
  t.plan(1);
  const breaker = cb('foobar');

  breaker.fire()
    .then((arg) => t.equals(arg, 'foobar', 'expected raw value returns'))
    .then(t.end)
    .catch(t.fail);
});

test('Works with callback functions', (t) => {
  t.plan(1);
  const promisified = cb.promisify(callbackFunction);
  const breaker = cb(promisified);

  breaker.fire(3, 4)
    .then((arg) => t.equals(arg, 7, 'CircuitBreaker.promisify works'))
    .then(t.end)
    .catch(t.fail);
});

test('Works with callback functions that fail', (t) => {
  t.plan(1);
  const promisified = cb.promisify(failedCallbackFunction);
  const breaker = cb(promisified);

  breaker.fire(3, 4)
    .then(t.fail)
    .catch((e) => t.equals(e, 'Whoops!', 'caught expected error'))
    .then(t.end);
});

test('Breaker opens after a configurable number of failures', (t) => {
  t.plan(2);
  const breaker = cb(passFail, { errorThresholdPercentage: 10 });

  breaker.fire(-1)
    .then(t.fail)
    .catch((e) => t.equals(e, 'Error: -1 is < 0', 'caught expected error'))
    .then(() => {
      // Now the breaker should be open, and should fast fail even
      // with a valid value
      breaker.fire(100)
        .then(t.fail)
        .catch((e) => t.equals(e.message, 'Breaker is open', 'breaker opens'))
        .then(t.end);
    })
    .catch(t.fail);
});

test('Breaker resets after a configurable amount of time', (t) => {
  t.plan(1);
  const fails = -1;
  const resetTimeout = 100;
  const breaker = cb(passFail, { errorThresholdPercentage: 1, resetTimeout });

  breaker.fire(fails)
    .catch(() => {
      // Now the breaker should be open. Wait for reset and
      // fire again.
      setTimeout(() => {
        breaker.fire(100)
          .then((arg) => t.equals(arg, 100, 'breaker has reset'))
          .then(t.end);
      }, resetTimeout * 1.25);
    });
});

test('Breaker status reflects open state', (t) => {
  t.plan(1);
  const breaker = cb(passFail, {errorThresholdPercentage: 0, resetTimeout: 100});
  breaker.fire(-1)
    .then(t.fail)
    .catch(() => t.ok(breaker.status.window[0].isCircuitBreakerOpen))
    .then(t.end);
});

test('Breaker resets for circuits with a fallback function', (t) => {
  t.plan(2);
  const fails = -1;
  const resetTimeout = 100;
  const breaker = cb(passFail, { errorThresholdPercentage: 1, resetTimeout });
  breaker.fallback((x) => x * 2);

  breaker.on('fallback', (result) => {
    t.equal(result, -2);
    // Now the breaker should be open. Wait for reset and
    // fire again.
    setTimeout(() => {
      breaker.fire(100)
        .then((arg) => {
          t.equals(arg, 100, 'breaker has reset');
        })
        .then(t.end)
        .catch(t.fail);
    }, resetTimeout * 1.25);
  });

  breaker.fire(fails);
});

test('Executes fallback action, if one exists, when breaker is open', (t) => {
  t.plan(1);
  const fails = -1;
  const expected = 100;
  const breaker = cb(passFail, { errorThresholdPercentage: 1 });
  breaker.fallback(() => expected);
  breaker.fire(fails)
    .then(() => {
      // Now the breaker should be open. See if fallback fires.
      breaker.fire()
        .then((x) => t.equals(x, expected, 'fallback action executes'))
        .then(t.end);
    });
});

test('Passes arguments to the fallback function', (t) => {
  t.plan(1);
  const fails = -1;
  const breaker = cb(passFail, { errorThresholdPercentage: 1 });
  breaker.on('fallback', (result) => {
    t.equals(result, fails, 'fallback received expected parameters');
    t.end();
  });
  breaker.fallback((x) => x);
  breaker.fire(fails).catch(t.fail);
});

test('Returns self from fallback()', (t) => {
  t.plan(1);
  cb(passFail, { errorThresholdPercentage: 1 })
    .fallback(() => {})
    .fire(1)
    .then((result) => {
      t.equals(result, 1, 'instance returned from fallback');
    })
    .then(t.end)
    .catch(t.fail);
});

test('CircuitBreaker emits failure when action throws', (t) => {
  t.plan(2);
  const breaker = cb(() => { throw new Error('E_TOOMANYCHICKENTACOS'); });
  breaker.fire()
    .then(t.fail)
    .catch((e) => {
      t.equals(breaker.status.stats.failures, 1, 'expected failure status');
      t.equals(e.message, 'E_TOOMANYCHICKENTACOS', 'expected error message');
      t.end();
    });
});

test('CircuitBreaker executes fallback when an action throws', (t) => {
  t.plan(3);
  const breaker = cb(() => { throw new Error('E_TOOMANYCHICKENTACOS'); })
    .fallback(() => 'Fallback executed');
  breaker.fire()
    .then((result) => {
      const stats = breaker.status.stats;
      t.equals(stats.failures, 1, 'expected failure status');
      t.equals(stats.fallbacks, 1, 'expected fallback status');
      t.equals(result, 'Fallback executed');
    })
    .catch(t.fail);
});

test('CircuitBreaker emits failure when falling back', (t) => {
  t.plan(2);
  const breaker = cb(passFail).fallback(() => 'fallback value');

  breaker.on('failure', (err) => {
    t.equals('Error: -1 is < 0', err, 'Expected failure');
  });

  breaker.fire(-1).then((result) => {
    t.equals('fallback value', result, 'fallback value is correct');
  }).catch(t.fail);
});

test('CircuitBreaker status', (t) => {
  t.plan(12);
  const breaker = cb(passFail, { errorThresholdPercentage: 1 });
  const deepEqual = (t, expected) => (actual) => t.deepEqual(actual, expected, 'expected status values');

  Promise.all([
    breaker.fire(10).then(deepEqual(t, 10)),
    breaker.fire(20).then(deepEqual(t, 20)),
    breaker.fire(30).then(deepEqual(t, 30))
  ])
    .then(() => t.deepEqual(breaker.status.stats.fires, 3, 'breaker fired 3 times'))
    .catch(t.fail)
    .then(() => {
      breaker.fire(-10)
        .then(t.fail)
        .catch((value) => {
          const stats = breaker.status.stats;
          t.equal(value, 'Error: -10 is < 0', 'fails with correct error message');
          t.equal(stats.failures, 1, 'status reports a single failure');
          t.equal(stats.fires, 4, 'status reports 4 fires');
        })
        .then(() => {
          breaker.fallback(() => 'Fallback called');
          breaker.fire(-20)
            .then((result) => {
              const stats = breaker.status.stats;
              t.equal(result, 'Fallback called', 'fallback is invoked');
              t.equal(stats.failures, 1, 'status reports 1 failure');
              t.equal(stats.rejects, 1, 'status reports 1 reject');
              t.equal(stats.fires, 5, 'status reports 5 fires');
              t.equal(stats.fallbacks, 1, 'status reports 1 fallback');
            })
            .catch(t.fail);
        })
        .catch(t.fail)
        .then(t.end);
    });
});

test('CircuitBreaker rolling counts', (t) => {
  const opts = { rollingCountTimeout: 200, rollingCountBuckets: 2 };
  const breaker = cb(passFail, opts);
  const deepEqual = (t, expected) => (actual) => t.deepEqual(actual, expected, 'expected status values');
  Promise.all([
    breaker.fire(10).then(deepEqual(t, 10)),
    breaker.fire(20).then(deepEqual(t, 20)),
    breaker.fire(30).then(deepEqual(t, 30))
  ])
    .then(() => {
      t.deepEqual(breaker.status.stats.successes, 3, 'breaker succeeded 3 times');
    })
    .then(() => {
      setTimeout(() => {
        const window = breaker.status.window;
        t.ok(window.length > 1);
        t.deepEqual(window[0].successes, 0, 'breaker reset stats');
        t.end();
      }, 300);
    });
});

test('CircuitBreaker status listeners', (t) => {
  const opts = { rollingCountTimeout: 2500, rollingCountBuckets: 25 };
  const breaker = cb(passFail, opts);

  breaker.status.on('snapshot', (snapshot) => {
    t.ok(snapshot.successes !== undefined, 'has successes stat');
    t.ok(snapshot.fires !== undefined, 'has fires stat');
    t.ok(snapshot.failures !== undefined, 'has failures stat');
    t.ok(snapshot.fallbacks !== undefined, 'has fallbacks stat');
    t.ok(snapshot.rejects !== undefined, 'has rejects stat');
    t.ok(snapshot.timeouts !== undefined, 'has timeouts stat');

    breaker.status.removeAllListeners('snapshot');
  });
  breaker.fire(10).then(_ => t.end());
});

test('CircuitBreaker fallback event', (t) => {
  t.plan(1);
  const breaker = cb(passFail, {errorThresholdPercentage: 0});
  breaker.fallback((x) => x);
  breaker.on('fallback', (value) => {
    t.equal(value, -1, 'fallback value received');
    t.end();
  });
  breaker.fire(-1);
});

test('CircuitBreaker events', (t) => {
  t.plan(41);
  const options = {
    errorThresholdPercentage: 1,
    timeout: 500,
    resetTimeout: 500
  };

  const breaker = cb(passFail, options);
  let fired = 0;
  let failures = 0;
  let success = 0;
  let reject = 0;
  let timeout = 0;
  let open = 0;
  let close = 0;
  let halfOpen = 0;
  let fallback = 0;

  breaker.on('fire', () => fired++);
  breaker.on('failure', () => failures++);
  breaker.on('success', () => success++);
  breaker.on('reject', () => reject++);
  breaker.on('timeout', () => timeout++);
  breaker.on('open', () => open++);
  breaker.on('close', () => close++);
  breaker.on('halfOpen', () => halfOpen++);
  breaker.on('fallback', () => fallback++);

  breaker.fire(10)
    .then(() => {
      t.equals(fired, 1, 'fire event fired');
      t.equals(success, 1, 'success event fired');
      t.equals(failures, 0, 'failure event did not fire');
      t.equals(reject, 0, 'reject event did not fire');
      t.equals(open, 0, 'open event did not fire');
      t.equals(close, 0, 'close event did not fire');
      t.equals(halfOpen, 0, 'halfOpen event did not fire');
      t.equals(timeout, 0, 'timeout event did not fire');
    })
    .then(() => {
      breaker.fire(-1)
        .then(t.fail)
        .catch((e) => {
          t.equals(fired, 2, 'fire event fired');
          t.equals(success, 1, 'success event did not fire');
          t.equals(failures, 1, 'failure event fired');
          t.equals(reject, 0, 'reject event did not fire');
          t.equals(open, 1, 'open event fired');
          t.equals(close, 0, 'close event did not fire');
          t.equals(halfOpen, 0, 'halfOpen event did not fire');
          t.equals(timeout, 0, 'timeout event did not fire');
        })
        .then(() => {
          breaker.fire(10)
            .then(t.fail)
            .catch((e) => {
              t.equals(fired, 3, 'fire event fired');
              t.equals(success, 1, 'success event did not fire');
              t.equals(failures, 1, 'failure event did not fire');
              t.equals(reject, 1, 'reject event fired');
              t.equals(open, 1, 'open event did not fire');
              t.equals(close, 0, 'close event did not fire');
              t.equals(halfOpen, 0, 'halfOpen event did not fire');
              t.equals(timeout, 0, 'timeout event did not fire');
            })
            .then(() => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  t.equals(fired, 3, 'fire event did not fire');
                  t.equals(success, 1, 'success event did not fire');
                  t.equals(failures, 1, 'failure event fired');
                  t.equals(reject, 1, 'reject event did not fire');
                  t.equals(open, 1, 'open event did not fire');
                  t.equals(close, 0, 'close event did not fire');
                  t.equals(halfOpen, 1, 'halfOpen event fired');
                  t.equals(timeout, 0, 'timeout event did not fire');
                  resolve();
                }, 500);
              })
              .then(() => {
                breaker.fire(10)
                  .then(() => {
                    t.equals(fired, 4, 'fire event fired');
                    t.equals(success, 2, 'success event fired');
                    t.equals(failures, 1, 'failure event fired');
                    t.equals(reject, 1, 'reject event did not fire');
                    t.equals(open, 1, 'open event did not fire');
                    t.equals(close, 1, 'close event fired');
                    t.equals(halfOpen, 1, 'halfOpen event did not fire');
                    t.equals(timeout, 0, 'timeout event did not fire');
                  })
                  .then(() => {
                    const timeoutBreaker = cb(slowFunction, options);
                    let timedOut = false;
                    timeoutBreaker.on('timeout', () => timedOut++);
                    timeoutBreaker.fire().then(t.fail);
                  })
                  .then((e) => t.equals(timeout, 0, 'timeout event fired'))
                  .then(t.end);
              });
            });
        });
    })
    .catch(t.fail);
});

test('circuit halfOpen', (t) => {
  t.plan(14);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = cb(passFail, options);
  breaker.fire(-1)
    .catch((e) => t.equals(e, 'Error: -1 is < 0', 'function should fail'))
    .then(() => {
      t.ok(breaker.opened, 'breaker should be open');
      t.notOk(breaker.pendingClose, 'breaker should not be pending close');
    })
    .then(() => {
      setTimeout(() => {
        t.ok(breaker.halfOpen, 'breaker should be halfOpen');
        t.ok(breaker.pendingClose, 'breaker should be pending close');
        // breaker should be half open, fail it again should open the circuit again
        breaker
          .fire(-1)
          .catch((e) => t.equals(e, 'Error: -1 is < 0', 'function should fail again'))
          .then(() => {
            t.ok(breaker.opened, 'breaker should be open again');
            t.notOk(breaker.halfOpen, 'breaker should not be halfOpen');
            t.notOk(breaker.pendingClose, 'breaker should not be pending close');
            setTimeout(() => {
              t.ok(breaker.halfOpen, 'breaker should be halfOpen again');
              t.ok(breaker.pendingClose, 'breaker should be pending close');
              // breaker should be half open again and it should allow the original function to be called, and it should pass this time.
              breaker
                .fire(1)
                .then((result) => {
                  t.equals(1, result);
                  t.ok(breaker.closed, 'breaker should be closed');
                  t.notOk(breaker.pendingClose, 'breaker should not be pending close');
                  t.end();
                })
                .catch(t.fail);
            }, options.resetTimeout * 1.1);
          });
      }, options.resetTimeout * 1.1);
    });
});

test('CircuitBreaker fallback as a rejected promise', (t) => {
  t.plan(1);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };
  const input = -1;
  const breaker = cb(passFail, options);
  breaker.fallback(() => Promise.reject(new Error('nope')));

  breaker.on('fallback', (resultPromise) => {
    resultPromise
      .then(t.fail)
      .catch((e) => t.equals('nope', e.message))
      .then(t.end);
  });

  breaker.fire(input);
});

test('CircuitBreaker fallback as a CircuitBreaker', (t) => {
  t.plan(1);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const input = -1;
  const breaker = cb(passFail, options);
  breaker.fallback(cb((x) => x, options));

  breaker.fire(input)
    .then((v) => t.equals(v, input, 'Fallback value equals input'))
    .then(t.end);
});

test('CircuitBreaker fallback as a CircuitBreaker that fails', (t) => {
  t.plan(1);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const input = -1;
  const breaker = cb(passFail, options);
  breaker.fallback(cb(passFail, options));

  breaker.fire(input)
    .catch((e) => t.equals(e, 'Error: -1 is < 0', 'Breaker should fail'))
    .then(t.end);
});

test('CircuitBreaker fallback as a CircuitBreaker', (t) => {
  t.plan(1);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const input = -1;
  const breaker = cb(passFail, options);
  breaker.fallback(cb((x) => x, options));

  breaker.fire(input)
    .then((v) => t.equals(v, input, 'Fallback value equals input'))
    .then(t.end);
});

test('options.maxFailures should be deprecated', (t) => {
  const options = { maxFailures: 1 };
  const originalLog = console.error;
  console.error = (msg) => {
    t.equals(msg, 'options.maxFailures is deprecated. Please use options.errorThresholdPercentage');
    // restore console.error
    console.error = originalLog;
    t.end();
  };
  cb(passFail, options);
});

/**
 * Returns a promise that resolves if the parameter
 * 'x' evaluates to >= 0. Otherwise the returned promise fails.
 */

 /* eslint prefer-promise-reject-errors: "off" */
function passFail (x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (x > 0) ? resolve(x) : reject(`Error: ${x} is < 0`);
    }, 100);
  });
}

/**
 * A function returning a promise that resolves
 * after 1 second.
 */
function slowFunction () {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve('done');
    }, 10000);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  });
}

function nonPromise () {
  return 'foo';
}

function callbackFunction (x, y, callback) {
  callback(null, x + y);
}

function failedCallbackFunction () {
  Array.prototype.slice.call(arguments).pop()('Whoops!');
}
