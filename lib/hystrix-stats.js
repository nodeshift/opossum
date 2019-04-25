'use strict';

const { Transform, Readable } = require('stream');
const formatter = require('./hystrix-formatter');

// use a single hystrix stream for all circuits
const hystrixStream = new Transform({
  objectMode: true,
  transform (stats, encoding, cb) {
    return cb(null, `data: ${JSON.stringify(formatter(stats))}\n\n`);
  }
});

hystrixStream.resume();

/**
 * Stream Hystrix Metrics for a given {@link CircuitBreaker}.
 * A HystrixStats instance is created for every {@link CircuitBreaker}
 * and does not typically need to be created by a user.
 *
 * A HystrixStats instance will listen for all events on the
 * {@link Status#snapshot}
 * and format the data to the proper Hystrix format.
 * Making it easy to construct an Event Stream for a client
 *
 * @class HystrixStats
 * @example
 * const circuit = circuitBreaker(fs.readFile, {});
 *
 * circuit.hystrixStats.getHystrixStream().pipe(response);
 * @param {CircuitBreaker} the circuit breaker
 * @see CircuitBreaker#hystrixStats
 */
class HystrixStats {
  constructor (circuit) {
    this._readableStream = new Readable({
      objectMode: true,
      read () {}
    });

    // Listen for the stats's snapshot event
    circuit.status.on('snapshot', function snapshotListener (stats) {
      // when we get a snapshot push it onto the stream
      this._readableStream.push(
        Object.assign({},
          {
            name: circuit.name,
            closed: circuit.closed,
            group: circuit.group,
            options: circuit.options
          }, stats));
    }.bind(this));

    this._readableStream.resume();
    this._readableStream.pipe(hystrixStream);
  }

  /**
    A convenience function that returns the hystrixStream
    @returns {ReadableStream} the statistics stream
  */
  getHystrixStream () {
    return hystrixStream;
  }

  /**
   * Shuts down this instance, freeing memory.
   * When a circuit is shutdown, it should call shutdown() on
   * its HystrixStats instance to avoid memory leaks.
   * @returns {void}
   */
  shutdown () {
    this._readableStream.unpipe(hystrixStream);
  }
}

HystrixStats.stream = hystrixStream;

module.exports = exports = HystrixStats;
