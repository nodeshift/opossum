const test = require('tape');
const CircuitBreaker = require('../');

const common = require('./common');
const passFail = common.passFail;

test('timeout defaults to 10000', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.options.timeout, 10000, 'should be set to 10000 by default');
  breaker.shutdown();
  t.end();
});

test('timeout can be set to 0', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    { timeout: 0 });
  t.equals(breaker.options.timeout, 0, 'should be set to 0');
  breaker.shutdown();
  t.end();
});

test('resetTimeout defaults to 30000', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.options.resetTimeout, 30000, 'should be set to 30000 by default');
  breaker.shutdown();
  t.end();
});

test('resetTimeout can be set to 0', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    { resetTimeout: 0 });
  t.equals(breaker.options.resetTimeout, 0, 'should be set to 0');
  breaker.shutdown();
  t.end();
});

test('errorThresholdPercentage defaults to 50', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.options.errorThresholdPercentage, 50, 'should be set to 50 by default');
  breaker.shutdown();
  t.end();
});

test('errorThresholdPercentage can be set to 0', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    { errorThresholdPercentage: 0 });
  t.equals(breaker.options.errorThresholdPercentage, 0, 'should be set to 0');
  breaker.shutdown();
  t.end();
});

test('rollingCountTimeout defaults to 10000', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.options.rollingCountTimeout, 10000, 'should be set to 10000 by default');
  breaker.shutdown();
  t.end();
});

test('rollingCountTimeout can be set to 0', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    { rollingCountTimeout: 0 });
  t.equals(breaker.options.rollingCountTimeout, 0, 'should be set to 0');
  breaker.shutdown();
  t.end();
});

test('rollingCountBuckets defaults to 10', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.options.rollingCountBuckets, 10, 'should be set to 10 by default');
  breaker.shutdown();
  t.end();
});

test('rollingCountBuckets can be set to 0', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    { rollingCountBuckets: 0 });
  t.equals(breaker.options.rollingCountBuckets, 0, 'should be set to 0');
  breaker.shutdown();
  t.end();
});
