'use strict';

const test = require('tape');
const CircuitBreaker = require('..');
const passFail = require('./common').passFail;

// tests that we are not leaving listeners open to
// chew up memory
test('EventEmitter max listeners', t => {
  let i = 100;
  while (--i >= 0) {
    const breaker = new CircuitBreaker(passFail, { name: `passFail${i}` });
    breaker.fire(1);
    breaker.shutdown(); // required for cleanup
  }
  t.end();
});

test('Circuit shuts down properly', t => {
  t.plan(5);
  const breaker = new CircuitBreaker(passFail);
  t.ok(breaker.fire(1), 'breaker is active');
  breaker.shutdown();
  t.ok(breaker.isShutdown, 'breaker is shutdown');
  t.notOk(breaker.enabled, 'breaker has been disabled');
  breaker.fire(1)
    .then(t.fail)
    .catch(err => {
      t.equals('ESHUTDOWN', err.code);
      t.equals('The circuit has been shutdown.', err.message);
      t.end();
    });
});

test('A list of non-shutdown circuits is maintained', t => {
  function expectCount(iterator, count) {
    // eslint-disable-next-line no-empty-pattern
    for (let {} of iterator) count--;
    return count === 0;
  }

  t.ok(expectCount(CircuitBreaker.circuits(), 0));

  const c1 = new CircuitBreaker(passFail);
  const c2 = new CircuitBreaker(passFail);

  t.ok(expectCount(CircuitBreaker.circuits(), 2));

  c2.shutdown();
  t.ok(expectCount(CircuitBreaker.circuits(), 1));

  c1.shutdown();
  t.ok(expectCount(CircuitBreaker.circuits(), 0));

  t.end();
});
