'use strict';

const test = require('tape');
const opossum = require('../');
const { passFail } = require('./common');

test('When disabled the circuit should always be closed', t => {
  t.plan(8);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 1000
  };

  const breaker = opossum(passFail, options);
  breaker.disable();
  breaker.fire(-1)
    .catch(e => t.equals(e, 'Error: -1 is < 0'))
    .then(() => {
      t.ok(breaker.closed, 'should be closed');
      t.notOk(breaker.pendingClose,
        'should not be pending close');
    })
    .then(() => {
      breaker // fire and fail again
        .fire(-1)
        .catch(e => t.equals(e, 'Error: -1 is < 0'))
        .then(() => {
          t.ok(breaker.closed, 'should be closed');
          t.notOk(breaker.pendingClose,
            'should not be pending close');
        });
    })
    .then(() => { // reenable the circuit
      breaker.enable();
      breaker.fire(-1)
        .catch(e => t.equals(e, 'Error: -1 is < 0'))
        .then(() => {
          t.ok(breaker.opened, 'should be closed');
        });
    });
});
