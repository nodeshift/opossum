'use strict';

const test = require('tape');
const circuitBreaker = require('../');
const { passFail } = require('./common');
const client = require('prom-client');

const { Registry } = client;

test('Factory metrics func does not fail if no circuits yet', t => {
  t.plan(1);
  t.equal(circuitBreaker.metrics(), undefined);
  t.end();
});

test('A circuit provides prometheus metrics when not in a web env', t => {
  t.plan(1);
  const circuit = circuitBreaker(passFail, {usePrometheus: true});
  t.ok(process.env.WEB ? circuit.metrics : !!circuit.metrics);
  circuit.metrics.clear();
  t.end();
});

test('Does not load Prometheus when the option is not provided', t => {
  t.plan(1);
  const circuit = circuitBreaker(passFail);
  t.ok(!circuit.metrics);
  circuit.shutdown();
  t.end();
});

test('The factory function provides access to metrics for all circuits', t => {
  t.plan(4);
  const c1 = circuitBreaker(passFail, { usePrometheus: true, name: 'fred' });
  const c2 = circuitBreaker(passFail, { usePrometheus: true, name: 'bob' });
  t.equal(c1.name, 'fred');
  t.equal(c2.name, 'bob');
  t.ok(/circuit_fred_/.test(circuitBreaker.metrics()));
  t.ok(/circuit_bob_/.test(circuitBreaker.metrics()));
  t.end();
});

test('The factory function uses a custom prom-client registry', t => {
  t.plan(4);
  const registry = new Registry();
  const c1 = circuitBreaker(passFail, {
    usePrometheus: true,
    name: 'fred',
    prometheusRegistry: registry
  });
  const c2 = circuitBreaker(passFail, {
    usePrometheus: true,
    name: 'bob',
    prometheusRegistry: registry
  });
  t.equal(c1.name, 'fred');
  t.equal(c2.name, 'bob');
  t.ok(/circuit_fred_/.test(registry.metrics()));
  t.ok(/circuit_bob_/.test(registry.metrics()));
  t.end();
});

// All of the additional tests only make sense when running in a Node.js context
if (!process.env.WEB) {
  test('Circuit fire/success/failure are counted', t => {
    const circuit = circuitBreaker(passFail, {usePrometheus: true});
    const fire = /circuit_passFail_fire 2/;
    const success = /circuit_passFail_success 1/;
    const failure = /circuit_passFail_failure 1/;
    t.plan(3);
    circuit.fire(1)
      .then(_ => circuit.fire(-1))
      .catch(_ => {
        const metrics = circuit.metrics.metrics;
        process.stdout.write(metrics);
        t.ok(fire.test(metrics), fire);
        t.ok(success.test(metrics), success);
        t.ok(failure.test(metrics), failure);
        circuit.metrics.clear();
        t.end();
      });
  });

  test('Metrics are enabled for all circuit events', t => {
    const circuit = circuitBreaker(passFail, {usePrometheus: true});
    const metrics = circuit.metrics.metrics;
    t.plan(circuit.eventNames().length);
    for (let name of circuit.eventNames()) {
      const match = new RegExp(`circuit_passFail_${name}`);
      t.ok(match.test(metrics), name);
    }
    circuit.metrics.clear();
    t.end();
  });

  test('Default prometheus metrics are enabled', t => {
    const circuit = circuitBreaker(passFail, {usePrometheus: true});
    const metrics = circuit.metrics.metrics;
    const names = [
      'process_cpu_seconds_total',
      'process_open_fds',
      'process_max_fds',
      'process_virtual_memory_bytes',
      'process_resident_memory_bytes',
      'process_heap_bytes',
      'process_start_time_seconds'
    ];
    t.plan(names.length);
    for (let name of names) {
      const match = new RegExp(`circuit_passFail_${name}`);
      t.ok(match.test(metrics), name);
    }
    circuit.metrics.clear();
    t.end();
  });

  test('Should not add default metrics to custom registry', t => {
    const registry = new Registry();
    const circuit = circuitBreaker(passFail, {
      usePrometheus: true,
      prometheusRegistry: registry
    });
    const metrics = circuit.metrics.metrics;
    const names = [
      'process_cpu_seconds_total',
      'process_open_fds',
      'process_max_fds',
      'process_virtual_memory_bytes',
      'process_resident_memory_bytes',
      'process_heap_bytes',
      'process_start_time_seconds'
    ];
    t.plan(names.length);
    for (let name of names) {
      const match = new RegExp(`circuit_passFail_${name}`);
      t.notOk(match.test(metrics), name);
    }
    circuit.metrics.clear();
    t.end();
  });

  test('Node.js specific metrics are enabled', t => {
    const circuit = circuitBreaker(passFail, {usePrometheus: true});
    const metrics = circuit.metrics.metrics;
    const names = [
      'nodejs_eventloop_lag',
      'nodejs_active_handles',
      'nodejs_active_requests',
      'nodejs_heap_size_total_bytes',
      'nodejs_heap_size_used_bytes',
      'nodejs_external_memory_bytes',
      'nodejs_heap_space_size_total_bytes',
      'nodejs_heap_space_size_used_bytes',
      'nodejs_heap_space_size_available_bytes',
      'nodejs_version_info'
    ];
    t.plan(names.length);
    for (let name of names) {
      const match = new RegExp(`circuit_passFail_${name}`);
      t.ok(match.test(metrics), name);
    }
    circuit.metrics.clear();
    t.end();
  });
}
