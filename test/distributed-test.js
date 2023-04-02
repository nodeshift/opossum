'use strict';

const test = require('tape');
const { createClient } = require('redis');

const CircuitBreaker = require('../');

function asyncFunctionThatCouldFail (x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
  distributed: {
    client: createClient({ url: 'redis://127.0.0.1:6379' , connect_timeout: 10})
  }
};

options.distributed.client.on('error', err => console.log('Redis Client Error', err));


test('Distributed testing', async t => {
  const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
  // await Promise.resolve(r => setTimeout(r, 2000));
  // t.comment(await options.distributed.client.keys());
});
