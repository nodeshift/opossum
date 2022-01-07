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
  t.plan(7);
  const breaker = new CircuitBreaker(passFail);
  breaker.on('shutdown', _ => {
    t.pass('Breaker emits Shutdown');
  });
  t.ok(breaker.fire(1), 'breaker is active');
  breaker.shutdown();
  t.ok(breaker.isShutdown, 'breaker is shutdown');
  t.notOk(breaker.enabled, 'breaker has been disabled');
  breaker.fire(1)
    .then(t.fail)
    .catch(err => {
      t.equals('ESHUTDOWN', err.code);
      t.equals('The circuit has been shutdown.', err.message);
      t.equals(
        CircuitBreaker.isOurError(err), true, 'isOurError() should return true'
      );
      t.end();
    });
});
