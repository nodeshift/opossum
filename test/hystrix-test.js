'use strict';

const test = require('tape');
const cb = require('../');
const HystrixStats = cb.HystrixStats;
const { passFail } = require('./common');

test('A circuit should provide stats to a hystrix compatible stream', t => {
  t.plan(2);
  const circuitOne = cb(passFail, {
    rollingCountTimeout: 100,
    rollingCountBuckets: 1,
    name: 'circuit one'
  });
  const circuitTwo = cb(passFail, {
    rollingCountTimeout: 100,
    rollingCountBuckets: 1,
    name: 'circuit two'
  });
  const hystrixStats = new HystrixStats([circuitOne, circuitTwo]);
  const stream = hystrixStats.getHystrixStream();
  let circuitOneStatsSeen = false;
  let circuitTwoStatsSeen = false;
  stream.on('data', blob => {
    const obj = JSON.parse(blob.substring(6));
    if (obj.name === 'circuit one') circuitOneStatsSeen = true;
    else if (obj.name === 'circuit two') circuitTwoStatsSeen = true;
  });
  circuitOne.fire(10).then(_ => circuitTwo.fire(10)).then(_ => {
    t.ok(circuitOneStatsSeen, 'circuit one stats seen');
    t.ok(circuitTwoStatsSeen, 'circuit two stats seen');
    t.end();
  });
});
