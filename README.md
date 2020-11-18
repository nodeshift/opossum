# opossum

![Node.js CI](https://github.com/nodeshift/opossum/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/opossum/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/opossum?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/opossum/badge.svg)](https://snyk.io/test/npm/opossum)
[![dependencies Status](https://david-dm.org/nodeshift/opossum/status.svg)](https://david-dm.org/nodeshift/opossum)

Opossum is a Node.js circuit breaker that executes asynchronous functions
and monitors their execution status. When things start failing, `opossum`
plays dead and fails fast. If you want, you can provide a fallback function
to be executed when in the failure state.

For more about the circuit breaker pattern, there are lots of resources
on the web - search it! Fowler's blog post is one place to
[start reading](http://martinfowler.com/bliki/CircuitBreaker.html).

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Documentation:  | https://nodeshift.dev/opossum/ |
| Typings:        | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/opossum
| Issue tracker:  | https://github.com/nodeshift/opossum/issues  |
| Engines:        | Node.js >= 10 |

## Usage

Let's say you've got an API that depends on something that might fail -
a network operation, or disk read, for example. Wrap those functions up in a
`CircuitBreaker` and you have control over your destiny.

```javascript
const CircuitBreaker = require('opossum');

function asyncFunctionThatCouldFail(x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(x, y)
  .then(console.log)
  .catch(console.error);
```

### Fallback

You can also provide a fallback function that will be executed in the
event of failure. To take some action when the fallback is performed,
listen for the `fallback` event.

```javascript
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now');
breaker.on('fallback', (result) => reportFallbackEvent(result));
```

Once the circuit has opened, a timeout is set based on `options.resetTimeout`.
When the `resetTimeout` expires, `opossum` will enter the `halfOpen` state.
Once in the `halfOpen` state, the next time the circuit is fired, the circuit's
action will be executed again. If successful, the circuit will close and emit
the `close` event. If the action fails or times out, it immediately re-enters
the `open` state.

When a fallback function is triggered, it's considered a failure, and the
fallback function will continue to be executed until the breaker is closed.

The fallback function accepts the same parameters as the fire function:

```javascript
const delay = (delay, a, b, c) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });

const breaker = new CircuitBreaker(delay);
breaker.fire(20000, 1, 2, 3);
breaker.fallback((delay, a, b, c) => `Sorry, out of service right now. But your parameters are: ${delay}, ${a}, ${b} and ${c}`);
```

### Browser

Opossum really shines in a browser. You can use it to guard against network
failures in your AJAX calls.

We recommend using [webpack](https://webpack.js.org/) to bundle your applications,
since it does not have the effect of polluting the `window` object with a global.
However, if you need it, you can access a `circuitBreaker` function in the global
namespace by doing something similar to what is shown in the below example.

Here is an example using [hapi.js](https://hapijs.com). See the
[opossum-examples](https://github.com/nodeshift-starters/opossum-examples/)
repository for more detail.

Include `opossum.js` in your HTML file.

```html
<html>
<head>
  <title>My Super App</title>
  <script type='text/javascript' src="/jquery.js"></script>
  <script type='text/javascript' src="/opossum.js"></script>
  <script type='text/javascript' src="/app.js"></script>
<body>
...
</body>
</head>
</html>
```

In your application, set a route to the file, pointing to
`node_modules/opossum/dist/opossum-min.js`.

```js
// server.js
const server = new Hapi.Server();
server.register(require('inert', (err) => possibleError(err)));
server.route({
  method: 'GET',
  path: '/opossum.js',
  handler: {
    file: {
      path: path.join(__dirname, 'node_modules', 'opossum', 'dist', 'opossum-min.js'),
    }
  }
});
```
In the browser's global scope will be a `CircuitBreaker` constructor. Use it
to create circuit breakers, guarding against network failures in your REST
API calls.

```js
// app.js
const route = 'https://example-service.com/rest/route';
const circuitBreakerOptions = {
  timeout: 500,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};

const breaker = new CircuitBreaker(() => $.get(route), circuitBreakerOptions);
breaker.fallback(() => `${route} unavailable right now. Try later.`));
breaker.on('success', (result) => $(element).append(JSON.stringify(result)}));

$(() => {
  $('#serviceButton').click(() => breaker.fire().catch((e) => console.error(e)));
});

```

### Events

A `CircuitBreaker` will emit events for important things that occur.
Here are the events you can listen for.

  * `fire` - emitted when the breaker is fired.
  * `reject` - emitted when the breaker is open (or halfOpen).
  * `timeout` - emitted when the breaker action times out.
  * `success` - emitted when the breaker action completes successfully
  * `failure` - emitted when the breaker action fails, called with the error
  * `open` - emitted when the breaker state changes to `open`
  * `close` - emitted when the breaker state changes to `closed`
  * `halfOpen` - emitted when the breaker state changes to `halfOpen`
  * `fallback` - emitted when the breaker has a fallback function and executes it
  * `semaphoreLocked` - emitted when the breaker is at capacity and cannot execute the request
  * `healthCheckFailed` - emitted when a user-supplied health check function returns a rejected promise

Handling events gives a greater level of control over your application behavior.

```js
const breaker = new CircuitBreaker(() => $.get(route), circuitBreakerOptions);

breaker.fallback(() => ({ body: `${route} unavailable right now. Try later.` }));

breaker.on('success',
  (result) => $(element).append(
    makeNode(`SUCCESS: ${JSON.stringify(result)}`)));

breaker.on('timeout',
  () => $(element).append(
    makeNode(`TIMEOUT: ${route} is taking too long to respond.`)));

breaker.on('reject',
  () => $(element).append(
    makeNode(`REJECTED: The breaker for ${route} is open. Failing fast.`)));

breaker.on('open',
  () => $(element).append(
    makeNode(`OPEN: The breaker for ${route} just opened.`)));

breaker.on('halfOpen',
  () => $(element).append(
    makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)));

breaker.on('close',
  () => $(element).append(
    makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)));

breaker.on('fallback',
  (data) => $(element).append(
    makeNode(`FALLBACK: ${JSON.stringify(data)}`)));
```


### Promises vs. Callbacks
The `opossum` API returns a `Promise` from `CircuitBreaker.fire()`.
But your circuit action - the async function that might fail -
doesn't have to return a promise. You can easily turn Node.js style
callback functions into something `opossum` understands by using the built in
Node core utility function `util.promisify()` .

```javascript
const fs = require('fs');
const { promisify } = require('util');
const CircuitBreaker = require('opossum');

const readFile = promisify(fs.readFile);
const breaker = new CircuitBreaker(readFile, options);

breaker.fire('./package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
```

And just for fun, your circuit doesn't even really have to be a function.
Not sure when you'd use this - but you could if you wanted to.

```javascript
const breaker = new CircuitBreaker('foo', options);

breaker.fire()
  .then(console.log) // logs 'foo'
  .catch(console.error);
```

### Typings

Typings are available [here](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/opossum).

If you'd like to add them, run `npm install @types/opossum` in your project.

### Metrics

#### Prometheus
The [`opossum-prometheus`](https://github.com/nodeshift/opossum-prometheus) module
can be used to produce metrics that are consumable by Prometheus.
These metrics include information about the circuit itself, for example how many
times it has opened, as well as general Node.js statistics, for example event loop lag.


#### Hystrix
The [`opossum-hystrix`](https://github.com/nodeshift/opossum-hystrix) module can
be used to produce metrics that are consumable by the Hystrix Dashboard.

## Troubleshooting

You may run into issues related to too many listeners on an `EventEmitter` like this.

```sh
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 10 unpipe listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 drain listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 error listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 finish listeners added. Use emitter.setMaxListeners() to increase limit
```

In some cases, seeing this error might indicate a bug in client code, where many `CircuitBreaker`s are inadvertently being created. But there are legitimate scenarios where this may not be the case. For example, it could just be that you need more than 10 `CircuitBreaker`s in your app. That's ok.

To get around the error, you can set the number of listeners on the stream.

```js
breaker.stats.getHystrixStream().setMaxListeners(100);
```

Or it could be that you have a large test suite which exercises some code that creates `CircuitBreaker`s and does so repeatedly. If the `CircuitBreaker` being created is only needed for the duration of the test, use `breaker.shutdown()` when the circuit is no longer in use to clean up all listeners.
