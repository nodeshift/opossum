'use strict';

const test = require('tape');
const CircuitBreaker = require('../');

const context = {
  lunch: 'sushi'
};

function getLunch (param) {
  return param
    ? Promise.resolve(param)
    : Promise.resolve(this.lunch);
}

getLunch.lunch = 'tacos';

test('Allows applying a "this" context', t => {
  t.plan(2);
  const circuit = new CircuitBreaker(getLunch);
  circuit.fire()
    .then(lunch => {
      t.equal(lunch, 'tacos');
    })
    .then(_ => {
      circuit.call(context)
        .then(lunch => {
          t.equal(lunch, 'sushi');
          t.end();
          circuit.shutdown();
        })
        .catch(t.end);
    })
    .catch(t.end);
});

test('The "this" context is used even when circuit is disabled', t => {
  t.plan(1);
  const circuit = new CircuitBreaker(getLunch);
  circuit.disable();
  circuit.call(context)
    .then(lunch => {
      t.equal(lunch, 'sushi');
      t.end();
      circuit.shutdown();
    })
    .catch(t.end);
});

test('The apply() method correctly passes arguments', t => {
  t.plan(1);
  const circuit = new CircuitBreaker(getLunch);
  circuit.call(context, 'burgers')
    .then(lunch => {
      t.equal(lunch, 'burgers');
      t.end();
      circuit.shutdown();
    })
    .catch(t.end);
});
