'use strict';

const test = require('tape');
const circuitBreaker = require('../');
const PrometheusMetrics = circuitBreaker.PrometheusMetrics;
const { passFail } = require('./common');
const client = require('prom-client');
const { Registry } = client;

test('The factory function provides access to metrics for all circuits', t => {
  t.plan(4);
  const c1 = circuitBreaker(passFail, { usePrometheus: true, name: 'fred' });
  const c2 = circuitBreaker(passFail, { usePrometheus: true, name: 'bob' });
  const prometheus = new PrometheusMetrics([c1, c2]);
  t.equal(c1.name, 'fred');
  t.equal(c2.name, 'bob');
  t.ok(/circuit_fred_/.test(prometheus.metrics));
  t.ok(/circuit_bob_/.test(prometheus.metrics));
  prometheus.clear();
  t.end();
});

test('The factory function uses a custom prom-client registry', t => {
  t.plan(6);
  const registry = new Registry();
  const c1 = circuitBreaker(passFail, {
    name: 'fred'
  });
  const c2 = circuitBreaker(passFail, {
    name: 'bob'
  });
  const prometheus = new PrometheusMetrics([c1, c2], registry);
  t.equal(c1.name, 'fred');
  t.equal(c2.name, 'bob');
  t.ok(/circuit_fred_/.test(registry.metrics()));
  t.ok(/circuit_bob_/.test(registry.metrics()));
  t.ok(/circuit_fred_/.test(prometheus.metrics));
  t.ok(/circuit_bob_/.test(prometheus.metrics));
  prometheus.clear();
  t.end();
});

// All of the additional tests only make sense when running in a Node.js context
if (!process.env.WEB) {
  test('Circuit fire/success/failure are counted', t => {
    const circuit = circuitBreaker(passFail);
    const fire = /circuit_passFail_fire 2/;
    const success = /circuit_passFail_success 1/;
    const failure = /circuit_passFail_failure 1/;
    const prometheus = new PrometheusMetrics([circuit]);
    t.plan(3);
    circuit.fire(1)
      .then(_ => circuit.fire(-1))
      .catch(_ => {
        const metrics = prometheus.metrics;
        t.ok(fire.test(metrics), fire);
        t.ok(success.test(metrics), success);
        t.ok(failure.test(metrics), failure);
        prometheus.clear();
        t.end();
      });
  });

  test('Metrics are enabled for all circuit events', t => {
    const circuit = circuitBreaker(passFail);
    const prometheus = new PrometheusMetrics([circuit]);
    const metrics = prometheus.metrics;
    t.plan(circuit.eventNames().length);
    for (let name of circuit.eventNames()) {
      const match = new RegExp(`circuit_passFail_${name}`);
      t.ok(match.test(metrics), name);
    }
    prometheus.clear();
    t.end();
  });

  test('Default prometheus metrics are enabled', t => {
    const circuit = circuitBreaker(passFail);
    const prometheus = new PrometheusMetrics([circuit]);
    const metrics = prometheus.metrics;
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
      const match = new RegExp(`opossum_${name}`);
      t.ok(match.test(metrics), name);
    }
    prometheus.clear();
    t.end();
  });

  test('Should not add default metrics to custom registry', t => {
    const registry = new Registry();
    const circuit = circuitBreaker(passFail);
    const prometheus = new PrometheusMetrics([circuit], registry);
    const metrics = prometheus.metrics;
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
      const match = new RegExp(`opossum_${name}`);
      t.notOk(match.test(metrics), name);
    }
    prometheus.clear();
    t.end();
  });

  test('Node.js specific metrics are enabled', t => {
    const circuit = circuitBreaker(passFail);
    const prometheus = new PrometheusMetrics([circuit]);
    const metrics = prometheus.metrics;
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
      const match = new RegExp(`opossum_${name}`);
      t.ok(match.test(metrics), name);
    }
    prometheus.clear();
    t.end();
  });
}
