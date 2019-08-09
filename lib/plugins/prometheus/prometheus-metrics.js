'use strict';

const client = require('prom-client');

// The current tests has circuit names like:
// 'circuit one' (with blank space) and others like
// 3beb8f49-62c0-46e0-b458-dcd4a62d0f48.
// So to avoid "Error: Invalid metric name" we are changing the
// circuit name to pass the tests.
// More details:
// https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels
function normalizePrefix(prefixName) {
  return `circuit_${prefixName.replace(/[ |-]/g, '_')}_`;
}

class PrometheusMetrics {
  constructor (circuits, registry) {
    this._registry = registry || client.register
    this._client = client;
    this.counters = [];

    if (!registry) {
      this.interval = this._client
        .collectDefaultMetrics({ prefix: 'opossum_', timeout: 5000 });
    }

    let prefix;
    circuits.forEach(circuit => {
      prefix = normalizePrefix(circuit.name);
      for (let eventName of circuit.eventNames()) {
        const counter = new this._client.Counter({
          name: `${prefix}${eventName}`,
          help: `A count of the ${circuit.name} circuit's ${eventName} event`,
          registers: [this._registry]
        });
        circuit.on(eventName, _ => {
          counter.inc();
        });
        this.counters.push(counter);
      }
    });
  }


  clear () {
    clearInterval(this.interval);
    this._registry.clear();
  }

  get metrics () {
    return this._registry.metrics();
  }

  get client () {
    return this._client;
  }
}

module.exports = PrometheusMetrics;
