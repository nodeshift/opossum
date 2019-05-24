'use strict';

const test = require('tape');
const cb = require('../');
const { passFail } = require('./common');

test('A circuit provides prometheus metrics when not in a web env', t => {
  t.plan(1);
  const circuit = cb(passFail, {usePrometheus: true});
  t.ok(process.env.WEB ? circuit.metrics : !!circuit.metrics);
  circuit.metrics.clear();
  t.end();
});

test('Does not load Prometheus when the option is not provided', t => {
  t.plan(1);
  const circuit = cb(passFail);
  t.ok(!circuit.metrics);
  circuit.shutdown();
  t.end();
});


// All of the additional tests only make sense when running in a Node.js context
if (!process.env.WEB) {
  test('Circuit fire/success/failure are counted', t => {
    const circuit = cb(passFail, {usePrometheus: true});
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
    const circuit = cb(passFail, {usePrometheus: true});
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
    const circuit = cb(passFail, {usePrometheus: true});
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

  test('Node.js specific metrics are enabled', t => {
    const circuit = cb(passFail, {usePrometheus: true});
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
