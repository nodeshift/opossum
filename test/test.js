const test = require('tape');
const Fidelity = require('fidelity');
const circuitBreaker = require('../');

test('api', (t) => {
  const breaker = circuitBreaker(passFail);
  t.ok(circuitBreaker.promisify);
  t.ok(breaker);
  t.ok(breaker.fire);
  t.notOk(breaker.open);
  t.notOk(breaker.halfOpen);
  t.ok(breaker.closed);
  t.ok(breaker.status);
  t.ok(breaker.options);
  t.equals(breaker.action, passFail);
  t.end();
});

test('Passes arguments to the circuit function', (t) => {
  const expected = 34;
  const breaker = circuitBreaker(passFail);

  breaker.fire(expected)
    .then((arg) => t.equals(arg, expected))
    .then(t.end)
    .catch(t.fail);
});

test('Fails when the circuit function fails', (t) => {
  const expected = -1;
  const breaker = circuitBreaker(passFail);

  breaker.fire(expected)
    .then(t.fail)
    .catch((e) => t.equals(e, expected))
    .then(t.end);
});

test('Fails when the circuit function times out', (t) => {
  const expected = 'Action timed out after 10ms';
  const breaker = circuitBreaker(slowFunction, { timeout: 10 });

  breaker.fire()
    .then(t.fail)
    .catch((e) => t.equals(e, expected))
    .then(t.end);
});

test('Works with functions that do not return a promise', (t) => {
  const breaker = circuitBreaker(nonPromise);

  breaker.fire()
    .then((arg) => t.equals(arg, 'foo'))
    .then(t.end)
    .catch(t.fail);
});

test('Works with non-functions', (t) => {
  const breaker = circuitBreaker('foobar');

  breaker.fire()
    .then((arg) => t.equals(arg, 'foobar'))
    .then(t.end)
    .catch(t.fail);
});

test('Works with callback functions', (t) => {
  const promisified = circuitBreaker.promisify(callbackFunction);
  const breaker = circuitBreaker(promisified);

  breaker.fire(3, 4)
    .then((arg) => t.equals(arg, 7))
    .then(t.end)
    .catch(t.fail);
});

test('Works with callback functions that fail', (t) => {
  const promisified = circuitBreaker.promisify(failedCallbackFunction);
  const breaker = circuitBreaker(promisified);

  breaker.fire(3, 4)
    .then(t.fail)
    .catch((e) => t.equals(e, 'Whoops!'))
    .then(t.end);
});

test('Breaker opens after a configurable number of failures', (t) => {
  const fails = -1;
  const breaker = circuitBreaker(passFail, { maxFailures: 1 });

  breaker.fire(fails)
    .then(t.fail)
    .catch((e) => t.equals(e, fails))
    .then(() => {
      // Now the breaker should be open, and should fast fail even
      // with a valid value
      breaker.fire(100)
        .then(t.fail)
        .catch((e) => t.equals(e, 'Breaker is open'))
        .then(t.end);
    });
});

test('Breaker resets after a configurable amount of time', (t) => {
  const fails = -1;
  const resetTimeout = 100;
  const breaker = circuitBreaker(passFail, { maxFailures: 1, resetTimeout });

  breaker.fire(fails)
    .catch(() => {
      // Now the breaker should be open. Wait for reset and
      // fire again.
      setTimeout(() => {
        breaker.fire(100)
          .then((arg) => t.equals(arg, 100))
          .then(t.end);
      }, resetTimeout * 1.25);
    });
});

test('Executes fallback action, if one exists, when breaker is open', (t) => {
  const fails = -1;
  const breaker = circuitBreaker(passFail, { maxFailures: 1 });
  breaker.fallback(() => 'fallback');
  breaker.fire(fails)
    .catch(() => {
      // Now the breaker should be open. See if fallback fires.
      breaker.fire()
        .then((arg) => {
          t.equals(arg, 'fallback');
        })
        .then(t.end)
        .catch(t.fail);
    });
});

test('Passes arguments to the fallback function', (t) => {
  const fails = -1;
  const expected = 100;
  const breaker = circuitBreaker(passFail, { maxFailures: 1 });
  breaker.fallback((x) => x);
  breaker.fire(fails)
    .catch(() => {
      // Now the breaker should be open. See if fallback fires.
      breaker.fire(expected)
        .then((arg) => {
          t.equals(arg, expected);
        })
        .then(t.end)
        .catch(t.fail);
    });
});

test('CircuitBreaker status', (t) => {
  const breaker = circuitBreaker(passFail, { maxFailures: 1 });
  const deepEqual = (t, expected) => (actual) => t.deepEqual(actual, expected);

  Fidelity.all([
    breaker.fire(10).then(deepEqual(t, 10)),
    breaker.fire(20).then(deepEqual(t, 20)),
    breaker.fire(30).then(deepEqual(t, 30))
  ])
    .then(() => t.deepEqual(breaker.status.fires, 3))
    .catch(t.fail)
    .then(() => {
      breaker.fire(-10)
        .then(t.fail)
        .catch((value) => {
          t.deepEqual(value, -10);
          t.deepEqual(breaker.status.failures, 1);
          t.deepEqual(breaker.status.fires, 4);
        })
        .then(() => {
          breaker.fallback(() => 'Fallback called');
          breaker.fire(-20)
            .then((result) => {
              // t.deepEqual(result, 'Fallback called');
              t.deepEqual(breaker.status.failures, 1);
              t.deepEqual(breaker.status.fires, 5);
              t.deepEqual(breaker.status.fallbacks, 1);
            })
            .catch(t.fail);
        })
        .then(t.end);
    });
});

/**
 * Returns a promise that resolves if the parameter
 * 'x' evaluates to >= 0. Otherwise the returned promise fails.
 */
function passFail (x) {
  return new Fidelity((resolve, reject) => {
    setTimeout(() => {
      (x >= 0) ? resolve(x) : reject(x);
    }, 100);
  });
}

/**
 * A function returning a promise that resolves
 * after 1 second.
 */
function slowFunction () {
  return new Fidelity((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, 10000).unref();
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
