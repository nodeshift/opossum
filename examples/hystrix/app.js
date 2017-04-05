const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const circuitBreaker = require('../../');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const baseline = process.env.CB_BASELINE || 20;
let delay = baseline;

function flakeFunction () {
  return new Promise((resolve, reject) => {
    if (delay > 1000) {
      return reject('Flakey Service is Flakey');
    }

    setTimeout(() => {
      console.log('replying with flakey response after delay of ', delay);
      resolve(`Sending flakey service. Current Delay at ${delay}`);
      delay = delay * 2;
    }, delay);
  });
}

setInterval(() => {
  if (delay !== baseline) {
    delay = baseline;
    console.log('resetting flakey service delay', delay);
  }
}, 20000);

// circuit breaker
const circuitBreakerOptions = {
  maxFailures: 5,
  timeout: 5000,
  resetTimeout: 10000,
  name: 'customName',
  group: 'customGroupName'
};

function fallback () {
  return 'Service Fallback';
}

const circuit = circuitBreaker(flakeFunction, circuitBreakerOptions);
circuit.fallback(fallback);

const hystrixStats = circuit.hystrixStats;

// setup our SSE endpoint
app.use('/hystrix.stream', (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive'});
  response.write('retry: 10000\n');
  response.write('event: connecttime\n');

  hystrixStats.getHystrixStream().pipe(response);
});

app.use('/', (request, response) => {
  circuit.fire().then((result) => {
    response.send(result);
  }).catch((err) => {
    response.send(err);
  });
});

module.exports = app;
