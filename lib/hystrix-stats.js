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

// TODO: This number is somewhat arbitrary. However, we need to allow
// a potentially large number of listeners on this transform stream
// because all circuits are connected to it. In an application with
// a large number of circuits (or tests using circuits), if left to
// the default MAX_LISTENERS, the user will see errors.
hystrixStream.setMaxListeners(100);
hystrixStream.resume();

/**
 * @class
 * <p>
 * Stream Hystrix Metrics for a given {@link CircuitBreaker}.
 * A HystrixStats instance is created for every {@link CircuitBreaker}
 * and does not typically need to be created by a user.
 * </p>
 * <p>
 * A HystrixStats instance will listen for all events on the
 * {@link CircuitBreaker.status.snapshot}
 * and format the data to the proper Hystrix format.
 * Making it easy to construct an Event Stream for a client
 * </p>
 *
 * @example
 * const circuit = circuitBreaker(fs.readFile, {});
 *
 * circuit.hystrixStats.getHystrixStream().pipe(response);
 * @see CircuitBreaker#hystrixStats
 */
class HystrixStats {
  constructor (circuit) {
    const _readableStream = new Readable({
      objectMode: true,
      read () {}
    });

    // Listen for the stats's snapshot event
    circuit.status.on('snapshot', function snapshotListener (stats) {
      // when we get a snapshot push it onto the stream
      _readableStream.push(
        Object.assign({},
          {
            name: circuit.name,
            closed: circuit.closed,
            group: circuit.group,
            options: circuit.options
          }, stats));
    });

    _readableStream.resume();
    _readableStream.pipe(hystrixStream);
  }

  /**
    A convenience function that returns the hystrxStream
  */
  getHystrixStream () {
    return hystrixStream;
  }
}

HystrixStats.stream = hystrixStream;

module.exports = exports = HystrixStats;
