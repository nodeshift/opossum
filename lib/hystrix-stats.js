'use strict';

const stream = require('stream');
const hystrixFormatter = require('./hystrix-formatter');

// only use a single hystrix stream for all circuits
const hystrixStream = new stream.Transform({
  objectMode: true
});

// The stats coming in should be already "Reduced"
function hystrixTransformer (stats, encoding, cb) {
  const formattedStats = hystrixFormatter(stats);

  // Need to take the stats and map them to the hystrix format
  return cb(null, `{"data": ${JSON.stringify(formattedStats)}}\n\n`);
}

// Need a _transform() function to satisfy the protocol
hystrixStream._transform = hystrixTransformer;
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
    this._circuit = circuit;

    // Listen for the stats's snapshot event
    this._circuit.status.on('snapshot',
      this._hystrixSnapshotListener.bind(this));

    this._readableStream = new stream.Readable({
      objectMode: true
    });

    this._readableStream._read = () => {};
    this._readableStream.resume();
    this._readableStream.pipe(hystrixStream);
  }

  /**
    A convenience function that returns the hystrxStream
  */
  getHystrixStream () {
    return hystrixStream;
  }

  // This will take the stats data from the listener and
  // push it on the stream to be transformed
  _hystrixSnapshotListener (stats) {
    const circuit = this._circuit;
    this._readableStream.push(
      Object.assign({},
        {
          name: circuit.name,
          closed: circuit.closed,
          group: circuit.group,
          options: circuit.options
        }, stats));
  }
}

module.exports = exports = HystrixStats;
