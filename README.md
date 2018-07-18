# opossum

[![Greenkeeper badge](https://badges.greenkeeper.io/bucharest-gold/opossum.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/bucharest-gold/opossum.svg?branch=master)](https://travis-ci.org/bucharest-gold/opossum)
[![Known Vulnerabilities](https://snyk.io/test/npm/opossum/badge.svg)](https://snyk.io/test/npm/opossum)
[![dependencies Status](https://david-dm.org/bucharest-gold/opossum/status.svg)](https://david-dm.org/bucharest-gold/opossum)

[![NPM](https://nodei.co/npm/opossum.png)](https://npmjs.org/package/opossum)

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
| Build:          | make  |
| Documentation:  | https://bucharest-gold.github.io/opossum/ |
| Issue tracker:  | https://github.com/bucharest-gold/opossum/issues  |
| Engines:        | Node.js 8.x, 10.x

## Usage

Let's say you've got an API that depends on something that might fail -
a network operation, or disk read, for example. Wrap those functions up in a
`CircuitBreaker` and you have control over your destiny.

```javascript
const circuitBreaker = require('opossum');

function asyncFunctionThatCouldFail (x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};
const breaker = circuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(params)
  .then(console.log)
  .catch(console.error);
```
### Fallback

You can also provide a fallback function that will be executed in the
event of failure. To take some action when the fallback is performed,
listen for the `fallback` event.

```javascript
const breaker = circuitBreaker(asyncFunctionThatCouldFail, options);
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

### Browser

Opossum really shines in a browser. You can use it to guard against network
failures in your AJAX calls.

We recommend using [webpack](https://webpack.js.org/) to bundle your applications,
since it does not have the effect of polluting the `window` object with a global.
However, if you need it, you can access a `circuitBreaker` function in the global
namespace by doing something similar to what is shown in the below example.

Here is an example using [hapi.js](https://hapijs.com). See the
[examples](https://github.com/bucharest-gold/opossum/tree/master/examples/)
folder for more detail.

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
In the browser's global scope will be a `circuitBreaker` function. Use it
to create circuit breakers, guarding against network failures in your REST
API calls.

```js
// app.js
const route = 'https://example-service.com/rest/route';
const circuitBreakerOptions = {
  timeout: 500,
  maxFailures: 3,
  resetTimeout: 5000
};

const circuit = circuitBreaker(() => $.get(route), circuitBreakerOptions);
circuit.fallback(() => `${route} unavailable right now. Try later.`));
circuit.on('success', (result) => $(element).append(JSON.stringify(result)}));

$(() => {
  $('#serviceButton').click(() => circuit.fire().catch((e) => console.error(e)));
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
* `semaphore-locked` - emitted when the breaker is at capacity and cannot execute the request
* `health-check-failed` - emitted when a user-supplied health check function returns a rejected promise

Handling events gives a greater level of control over your application behavior.

```js
const circuit = circuitBreaker(() => $.get(route), circuitBreakerOptions);

circuit.fallback(() => ({ body: `${route} unavailable right now. Try later.` }));

circuit.on('success',
  (result) => $(element).append(
    makeNode(`SUCCESS: ${JSON.stringify(result)}`)));

circuit.on('timeout',
  () => $(element).append(
    makeNode(`TIMEOUT: ${route} is taking too long to respond.`)));

circuit.on('reject',
  () => $(element).append(
    makeNode(`REJECTED: The breaker for ${route} is open. Failing fast.`)));

circuit.on('open',
  () => $(element).append(
    makeNode(`OPEN: The breaker for ${route} just opened.`)));

circuit.on('halfOpen',
  () => $(element).append(
    makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)));

circuit.on('close',
  () => $(element).append(
    makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)));

circuit.on('fallback',
  (data) => $(element).append(
    makeNode(`FALLBACK: ${JSON.stringify(data)}`)));
```


### Promises vs. Callbacks
The `opossum` API returns a `Promise` from `CircuitBreaker.fire()`.
But your circuit action - the async function that might fail -
doesn't have to return a promise. You can easily turn Node.js style
callback functions into something `opossum` understands by using
`circuitBreaker.promisify()`.

```javascript
const fs = require('fs');
const circuitBreaker = require('opossum');

const readFile = circuitBreaker.promisify(fs.readFile);
const breaker = circuitBreaker(readFile, options);

breaker.fire('./package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
```

And just for fun, your circuit doesn't even really have to be a function.
Not sure when you'd use this - but you could if you wanted to.

```javascript
const breaker = circuitBreaker('foo', options);

breaker.fire()
  .then(console.log) // logs 'foo'
  .catch(console.error);
```

### Hystrix Metrics

A Hystrix Stream is available for use with a Hystrix Dashboard using the `circuitBreaker.hystrixStats.getHystrixStream` method.

This method returns a [Node.js Stream](https://nodejs.org/api/stream.html), which makes it easy to create an SSE stream that will be compliant with a Hystrix Dashboard.

Additional Reading: [Hystrix Metrics Event Stream](https://github.com/Netflix/Hystrix/tree/master/hystrix-contrib/hystrix-metrics-event-stream), [Turbine](https://github.com/Netflix/Turbine/wiki), [Hystrix Dashboard](https://github.com/Netflix/Hystrix/wiki/Dashboard)
